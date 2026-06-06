const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'payments',
  moduleName: 'Payments',
  orderBy: '`updated_at` DESC',
  filters: ['client_unit_id', 'status'],
  columns: [
    'client_unit_id',
    'payment_date',
    'amount',
    'payment_type',
    'payment_method',
    'bank_name',
    'reference_no',
    'status',
    'verified_by',
    'verified_at',
    'remarks',
    'receipt_url',
    'receipt_public_id',
  ],
})
