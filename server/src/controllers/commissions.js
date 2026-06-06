const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'commissions',
  moduleName: 'Commissions',
  orderBy: '`updated_at` DESC',
  filters: ['client_unit_id', 'user_id', 'status'],
  columns: [
    'client_unit_id',
    'user_id',
    'commission_type',
    'sale_type',
    'rate',
    'gross_commission',
    'status',
    'approved_by',
    'approved_at',
  ],
})
