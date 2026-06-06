const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'payment_schedules',
  moduleName: 'Payment Schedules',
  orderBy: '`due_date` ASC, `id` ASC',
  filters: ['client_unit_id', 'status'],
  columns: ['client_unit_id', 'due_date', 'description', 'due_amount', 'penalty', 'status'],
})
