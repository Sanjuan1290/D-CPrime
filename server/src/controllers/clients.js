const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'clients',
  moduleName: 'Clients',
  orderBy: '`updated_at` DESC',
  columns: ['buyer_name', 'spouse_co_owner_name', 'aif_administrator_name', 'email', 'contact_no', 'age', 'address'],
})
