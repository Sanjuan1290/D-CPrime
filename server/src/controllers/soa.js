const db = require('../config/db')
const httpError = require('../utils/httpError')

async function getByClientUnit(req, res) {
  const [clientUnits] = await db.query(
    `SELECT cu.*, c.buyer_name, l.unit_id, p.name AS project_name
     FROM client_units cu
     JOIN clients c ON c.id = cu.client_id
     JOIN listings l ON l.id = cu.listing_id
     JOIN projects p ON p.id = l.project_id
     WHERE cu.id = ?
     LIMIT 1`,
    [req.params.clientUnitId],
  )
  const clientUnit = clientUnits[0]

  if (!clientUnit) throw httpError(404, 'Client unit not found')

  const [schedule] = await db.query(
    'SELECT * FROM payment_schedules WHERE client_unit_id = ? ORDER BY due_date ASC',
    [req.params.clientUnitId],
  )
  const [payments] = await db.query(
    "SELECT * FROM payments WHERE client_unit_id = ? AND status = 'verified' ORDER BY payment_date ASC",
    [req.params.clientUnitId],
  )

  res.json({ clientUnit, schedule, payments })
}

module.exports = { getByClientUnit }
