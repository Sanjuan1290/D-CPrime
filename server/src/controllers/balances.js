const db = require('../config/db')
const { pagination } = require('../utils/crud')

async function list(req, res) {
  const { page, limit, offset } = pagination(req.query)
  const [rows] = await db.query('SELECT * FROM v_client_balances ORDER BY buyer_name ASC LIMIT ? OFFSET ?', [
    limit,
    offset,
  ])
  const [[count]] = await db.query('SELECT COUNT(*) AS total FROM v_client_balances')

  res.json({
    data: rows,
    pagination: {
      page,
      limit,
      total: count.total,
      totalPages: Math.max(1, Math.ceil(count.total / limit)),
    },
  })
}

module.exports = { list }
