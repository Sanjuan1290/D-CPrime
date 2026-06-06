const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'cash_advances',
  moduleName: 'Cash Advances',
  orderBy: '`updated_at` DESC',
  filters: ['user_id', 'status'],
  columns: ['user_id', 'client_unit_id', 'commission_id', 'amount', 'reason', 'status', 'approved_by', 'approved_at'],
})
