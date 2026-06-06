const db = require('../config/db')
const httpError = require('../utils/httpError')
const { logAudit } = require('../utils/audit')
const { pagination } = require('../utils/crud')
const { publicUser } = require('./auth')

function normalizeLog(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id,
    barcode_value: row.barcode_value,
    barcodeValue: row.barcode_value,
    type: row.type,
    scanned_at: row.scanned_at,
    scannedAt: row.scanned_at,
    edited_by: row.edited_by,
    editedBy: row.edited_by,
    edited_at: row.edited_at,
    editedAt: row.edited_at,
    original_time: row.original_time,
    originalTime: row.original_time,
    notes: row.notes,
    user: publicUser(row.full_name ? row : null),
  }
}

async function scan(req, res) {
  const { barcode_value: barcodeValue, type } = req.body

  if (!barcodeValue) throw httpError(400, 'Barcode value is required')
  if (!['time_in', 'time_out'].includes(type)) throw httpError(400, 'Attendance type must be time_in or time_out')

  const [users] = await db.query(
    `SELECT id, full_name, email, contact_no, role, status, barcode_value, avatar_url
     FROM users
     WHERE barcode_value = ? AND status = 'active'
     LIMIT 1`,
    [barcodeValue],
  )
  const user = users[0]

  if (!user) throw httpError(404, 'Employee barcode not registered')

  const [result] = await db.query('INSERT INTO attendance_logs (user_id, barcode_value, type) VALUES (?, ?, ?)', [
    user.id,
    barcodeValue,
    type,
  ])
  const [logs] = await db.query('SELECT * FROM attendance_logs WHERE id = ? LIMIT 1', [result.insertId])

  await logAudit({
    userId: req.user?.id,
    action: type === 'time_in' ? 'Recorded time in' : 'Recorded time out',
    moduleName: 'Attendance',
    entityTable: 'attendance_logs',
    entityId: result.insertId,
    newValues: logs[0],
    ipAddress: req.ip,
  })

  res.status(201).json({ user: publicUser(user), log: normalizeLog({ ...logs[0], ...user }) })
}

async function list(req, res) {
  const { page, limit, offset } = pagination(req.query)
  const where = []
  const values = []

  if (req.query.date) {
    where.push('DATE(al.scanned_at) = ?')
    values.push(req.query.date)
  }

  if (req.query.user_id) {
    where.push('al.user_id = ?')
    values.push(req.query.user_id)
  }

  if (req.query.type) {
    where.push('al.type = ?')
    values.push(req.query.type)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const [rows] = await db.query(
    `SELECT al.*, u.full_name, u.email, u.contact_no, u.role, u.status, u.avatar_url
     FROM attendance_logs al
     JOIN users u ON u.id = al.user_id
     ${whereSql}
     ORDER BY al.scanned_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset],
  )
  const [[count]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM attendance_logs al
     JOIN users u ON u.id = al.user_id
     ${whereSql}`,
    values,
  )

  res.json({
    data: rows.map(normalizeLog),
    pagination: {
      page,
      limit,
      total: count.total,
      totalPages: Math.max(1, Math.ceil(count.total / limit)),
    },
  })
}

async function today(req, res) {
  const [rows] = await db.query(
    `SELECT al.*, u.full_name, u.email, u.contact_no, u.role, u.status, u.avatar_url
     FROM attendance_logs al
     JOIN users u ON u.id = al.user_id
     WHERE DATE(al.scanned_at) = CURDATE()
     ORDER BY al.scanned_at DESC`,
  )

  const latestByUser = new Map()
  for (const row of rows) {
    if (!latestByUser.has(row.user_id)) latestByUser.set(row.user_id, normalizeLog(row))
  }

  res.json({
    date: new Date().toISOString().slice(0, 10),
    logs: rows.map(normalizeLog),
    summary: Array.from(latestByUser.values()),
  })
}

async function update(req, res) {
  const { scanned_at: scannedAt, notes } = req.body

  if (!scannedAt && notes === undefined) throw httpError(400, 'Provide scanned_at or notes')

  const [beforeRows] = await db.query('SELECT * FROM attendance_logs WHERE id = ? LIMIT 1', [req.params.id])
  const before = beforeRows[0]
  if (!before) throw httpError(404, 'Attendance log not found')

  await db.query(
    `UPDATE attendance_logs
     SET scanned_at = COALESCE(?, scanned_at),
         notes = ?,
         edited_by = ?,
         edited_at = NOW(),
         original_time = COALESCE(original_time, ?)
     WHERE id = ?`,
    [scannedAt || null, notes ?? before.notes, req.user?.id || null, before.scanned_at, req.params.id],
  )

  const [afterRows] = await db.query(
    `SELECT al.*, u.full_name, u.email, u.contact_no, u.role, u.status, u.avatar_url
     FROM attendance_logs al
     JOIN users u ON u.id = al.user_id
     WHERE al.id = ?
     LIMIT 1`,
    [req.params.id],
  )

  await logAudit({
    userId: req.user?.id,
    action: 'Edited attendance log',
    moduleName: 'Attendance',
    entityTable: 'attendance_logs',
    entityId: req.params.id,
    oldValues: before,
    newValues: afterRows[0],
    ipAddress: req.ip,
  })

  res.json(normalizeLog(afterRows[0]))
}

module.exports = { scan, list, today, update }
