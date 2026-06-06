const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'client_units',
  moduleName: 'Client Units',
  orderBy: '`updated_at` DESC',
  filters: ['client_id', 'listing_id', 'assigned_agent_id', 'assigned_manager_id', 'account_status', 'payment_status'],
  columns: [
    'client_id',
    'listing_id',
    'reservation_id',
    'assigned_agent_id',
    'assigned_manager_id',
    'reservation_date',
    'contract_date',
    'mode_of_payment',
    'contract_price',
    'legal_misc_fee',
    'total_contract_price',
    'payment_terms_months',
    'monthly_amortization',
    'due_day',
    'document_status',
    'account_status',
    'payment_status',
    'sales_status',
    'remarks',
  ],
})
