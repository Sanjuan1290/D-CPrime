const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'reservations',
  moduleName: 'Reservations',
  orderBy: '`updated_at` DESC',
  filters: ['client_id', 'listing_id', 'reserved_by', 'status'],
  columns: ['client_id', 'listing_id', 'reserved_by', 'reservation_fee', 'reservation_date', 'expires_at', 'status', 'remarks'],
})
