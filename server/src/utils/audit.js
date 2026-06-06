const db = require('../config/db')

async function logAudit({ userId, action, moduleName, entityTable, entityId, oldValues, newValues, ipAddress }) {
  await db.query(
    `INSERT INTO audit_logs
      (user_id, action, module_name, entity_table, entity_id, old_values, new_values, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId || null,
      action,
      moduleName || null,
      entityTable || null,
      entityId || null,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
      ipAddress || null,
    ],
  )
}

module.exports = { logAudit }
