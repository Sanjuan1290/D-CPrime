const db = require('../config/db')

async function summary(req, res) {
  const [[clients]] = await db.query('SELECT COUNT(*) AS total FROM clients')
  const [[listings]] = await db.query('SELECT COUNT(*) AS total FROM listings')
  const [[availableListings]] = await db.query("SELECT COUNT(*) AS total FROM listings WHERE status = 'available'")
  const [[payments]] = await db.query("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'verified'")
  const [[pendingPayments]] = await db.query("SELECT COUNT(*) AS total FROM payments WHERE status = 'pending'")
  const [[reservations]] = await db.query("SELECT COUNT(*) AS total FROM reservations WHERE status IN ('pending', 'confirmed')")
  const [[sales]] = await db.query(
    `SELECT
       COALESCE(SUM(total_contract_price), 0) AS total_sales,
       COALESCE(SUM(CASE WHEN account_status = 'active' THEN total_contract_price ELSE 0 END), 0) AS active_sales
     FROM client_units`,
  )
  const [[balances]] = await db.query(
    `SELECT
       COALESCE(SUM(total_paid), 0) AS total_paid,
       COALESCE(SUM(balance), 0) AS total_balance
     FROM v_client_balances`,
  )
  const [[listingValues]] = await db.query(
    `SELECT
       COALESCE(SUM(total_contract_price), 0) AS total_listed_value,
       COALESCE(SUM(CASE WHEN status = 'available' THEN total_contract_price ELSE 0 END), 0) AS available_value,
       COALESCE(SUM(CASE WHEN status = 'sold' THEN total_contract_price ELSE 0 END), 0) AS sold_value,
       COALESCE(SUM(CASE WHEN status = 'reserved' THEN total_contract_price ELSE 0 END), 0) AS reserved_value
     FROM listings`,
  )
  const [[documents]] = await db.query(
    "SELECT COUNT(*) AS pending FROM client_unit_documents WHERE status IN ('not_submitted', 'pending', 'rejected')",
  )
  const [[commissions]] = await db.query(
    `SELECT
       COALESCE(SUM(gross_commission), 0) AS payable,
       COALESCE(SUM(CASE WHEN status = 'released' THEN gross_commission ELSE 0 END), 0) AS released,
       COALESCE(SUM(CASE WHEN status <> 'released' THEN gross_commission ELSE 0 END), 0) AS remaining
     FROM commissions`,
  )
  const [lotStatusData] = await db.query(
    `SELECT
       status AS name,
       COUNT(*) AS count,
       COALESCE(SUM(total_contract_price), 0) AS value
     FROM listings
     GROUP BY status
     ORDER BY FIELD(status, 'sold', 'reserved', 'available', 'hold', 'inactive')`,
  )
  const [agentPerformance] = await db.query(
    `SELECT
       u.full_name AS agent,
       COALESCE(SUM(cu.total_contract_price), 0) AS totalSales,
       SUM(CASE WHEN cu.account_status = 'active' THEN 1 ELSE 0 END) AS active,
       SUM(CASE WHEN cu.account_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
       COALESCE(SUM(CASE WHEN cu.account_status = 'active' THEN cu.total_contract_price ELSE 0 END), 0) AS net
     FROM users u
     JOIN client_units cu ON cu.assigned_agent_id = u.id
     WHERE u.role IN ('agent', 'broker', 'manager')
     GROUP BY u.id, u.full_name
     ORDER BY totalSales DESC
     LIMIT 10`,
  )

  res.json({
    metrics: {
      clients: clients.total,
      listings: listings.total,
      availableListings: availableListings.total,
      verifiedCollections: Number(payments.total || 0),
      pendingPayments: pendingPayments.total,
      activeReservations: reservations.total,
      totalSales: Number(sales.total_sales || 0),
      activeSales: Number(sales.active_sales || 0),
      totalPaid: Number(balances.total_paid || 0),
      totalBalance: Number(balances.total_balance || 0),
      totalListedValue: Number(listingValues.total_listed_value || 0),
      availableValue: Number(listingValues.available_value || 0),
      soldValue: Number(listingValues.sold_value || 0),
      reservedValue: Number(listingValues.reserved_value || 0),
      pendingDocuments: documents.pending,
      commissionPayable: Number(commissions.payable || 0),
      commissionReleased: Number(commissions.released || 0),
      commissionRemaining: Number(commissions.remaining || 0),
    },
    lotStatusData: lotStatusData.map((item) => ({
      name: item.name,
      count: item.count,
      value: Number(item.value || 0),
    })),
    agentPerformance: agentPerformance.map((item) => ({
      agent: item.agent,
      totalSales: Number(item.totalSales || 0),
      active: Number(item.active || 0),
      cancelled: Number(item.cancelled || 0),
      net: Number(item.net || 0),
    })),
  })
}

module.exports = { summary }
