const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'commission_releases',
  moduleName: 'Commission Releases',
  orderBy: '`released_at` DESC, `id` DESC',
  filters: ['commission_id', 'released_by'],
  columns: [
    'commission_id',
    'release_stage',
    'release_percentage',
    'gross_release_amount',
    'cash_advance_deduction',
    'net_release_amount',
    'released_by',
    'released_at',
    'remarks',
  ],
})
