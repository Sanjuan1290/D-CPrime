const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'projects',
  moduleName: 'Projects',
  orderBy: '`updated_at` DESC',
  filters: ['status'],
  columns: ['name', 'location', 'administrator', 'tax_declaration_no', 'pin', 'status'],
})
