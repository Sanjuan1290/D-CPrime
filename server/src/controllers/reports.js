const db = require('../config/db')

async function list(req, res) {
  const [[collections]] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'verified'",
  )
  const [[receivables]] = await db.query('SELECT COALESCE(SUM(balance), 0) AS total FROM v_client_balances')
  const [salesByProject] = await db.query(
    `SELECT p.name AS project_name, COUNT(cu.id) AS sales_count, COALESCE(SUM(cu.total_contract_price), 0) AS contract_value
     FROM projects p
     LEFT JOIN listings l ON l.project_id = p.id
     LEFT JOIN client_units cu ON cu.listing_id = l.id
     GROUP BY p.id, p.name
     ORDER BY contract_value DESC`,
  )

  res.json({
    collections: Number(collections.total || 0),
    receivables: Number(receivables.total || 0),
    salesByProject,
  })
}

module.exports = { list }
