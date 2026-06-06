const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'audit_logs',
  moduleName: 'Audit Logs',
  orderBy: '`created_at` DESC',
  filters: ['user_id', 'module_name', 'entity_table'],
  columns: ['user_id', 'action', 'module_name', 'entity_table', 'entity_id', 'old_values', 'new_values', 'ip_address'],
})
