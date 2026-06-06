const bcrypt = require('bcrypt')
const db = require('../config/db')
const httpError = require('../utils/httpError')
const { logAudit } = require('../utils/audit')
const { pagination } = require('../utils/crud')
const { publicUser } = require('./auth')

const allowedFields = [
  'full_name',
  'email',
  'contact_no',
  'role',
  'status',
  'accreditation_date',
  'barcode_value',
  'avatar_url',
]

function userSelect() {
  return `id, full_name, email, contact_no, role, status, accreditation_date, last_login, barcode_value, avatar_url, created_at, updated_at`
}

function cleanUserPayload(body) {
  return Object.fromEntries(
    Object.entries(body || {}).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
  )
}

async function list(req, res) {
  const { page, limit, offset } = pagination(req.query)
  const where = []
  const values = []

  if (req.query.role) {
    where.push('role = ?')
    values.push(req.query.role)
  }

  if (req.query.status) {
    where.push('status = ?')
    values.push(req.query.status)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const [rows] = await db.query(
    `SELECT ${userSelect()} FROM users ${whereSql} ORDER BY full_name ASC LIMIT ? OFFSET ?`,
    [...values, limit, offset],
  )
  const [[count]] = await db.query(`SELECT COUNT(*) AS total FROM users ${whereSql}`, values)

  res.json({
    data: rows.map(publicUser),
    pagination: {
      page,
      limit,
      total: count.total,
      totalPages: Math.max(1, Math.ceil(count.total / limit)),
    },
  })
}

async function get(req, res) {
  const [rows] = await db.query(`SELECT ${userSelect()} FROM users WHERE id = ? LIMIT 1`, [req.params.id])
  const user = rows[0]

  if (!user) throw httpError(404, 'User not found')
  res.json(publicUser(user))
}

async function create(req, res) {
  const payload = cleanUserPayload(req.body)

  if (!payload.full_name || !payload.role) throw httpError(400, 'Full name and role are required')
  if (req.body.password) {
    payload.password_hash = await bcrypt.hash(req.body.password, 12)
  }

  const columns = Object.keys(payload)
  const [result] = await db.query(
    `INSERT INTO users (${columns.map((column) => `\`${column}\``).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
    columns.map((column) => payload[column]),
  )
  const [rows] = await db.query(`SELECT ${userSelect()} FROM users WHERE id = ? LIMIT 1`, [result.insertId])
  const user = rows[0]

  await logAudit({
    userId: req.user?.id,
    action: 'Created user',
    moduleName: 'Users',
    entityTable: 'users',
    entityId: result.insertId,
    newValues: user,
    ipAddress: req.ip,
  })

  res.status(201).json(publicUser(user))
}

async function update(req, res) {
  const payload = cleanUserPayload(req.body)

  if (req.body.password) {
    payload.password_hash = await bcrypt.hash(req.body.password, 12)
  }

  const columns = Object.keys(payload)
  if (!columns.length) throw httpError(400, 'No valid fields provided')

  const [beforeRows] = await db.query(`SELECT ${userSelect()} FROM users WHERE id = ? LIMIT 1`, [req.params.id])
  const before = beforeRows[0]
  if (!before) throw httpError(404, 'User not found')

  await db.query(
    `UPDATE users SET ${columns.map((column) => `\`${column}\` = ?`).join(', ')} WHERE id = ?`,
    [...columns.map((column) => payload[column]), req.params.id],
  )
  const [afterRows] = await db.query(`SELECT ${userSelect()} FROM users WHERE id = ? LIMIT 1`, [req.params.id])
  const after = afterRows[0]

  await logAudit({
    userId: req.user?.id,
    action: 'Updated user',
    moduleName: 'Users',
    entityTable: 'users',
    entityId: req.params.id,
    oldValues: before,
    newValues: after,
    ipAddress: req.ip,
  })

  res.json(publicUser(after))
}

async function remove(req, res) {
  const [rows] = await db.query(`SELECT ${userSelect()} FROM users WHERE id = ? LIMIT 1`, [req.params.id])
  const user = rows[0]
  if (!user) throw httpError(404, 'User not found')

  await db.query("UPDATE users SET status = 'inactive' WHERE id = ?", [req.params.id])

  await logAudit({
    userId: req.user?.id,
    action: 'Deactivated user',
    moduleName: 'Users',
    entityTable: 'users',
    entityId: req.params.id,
    oldValues: user,
    ipAddress: req.ip,
  })

  res.status(204).send()
}

module.exports = { list, get, create, update, remove }
