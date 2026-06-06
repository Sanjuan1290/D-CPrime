const db = require('../config/db')
const { pagination } = require('../utils/crud')
const { publicUser } = require('./auth')

async function list(req, res) {
  const { page, limit, offset } = pagination(req.query)
  const staffRoles = ['owner', 'admin', 'treasury', 'broker', 'manager', 'agent']
  const role = staffRoles.includes(req.query.role) ? req.query.role : null
  const whereSql = role ? 'WHERE role = ?' : `WHERE role IN (${staffRoles.map(() => '?').join(', ')})`
  const values = role ? [role] : staffRoles

  const [rows] = await db.query(
    `SELECT id, full_name, email, contact_no, role, status, accreditation_date, last_login, barcode_value, avatar_url
     FROM users ${whereSql}
     ORDER BY role ASC, full_name ASC
     LIMIT ? OFFSET ?`,
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

module.exports = { list }
