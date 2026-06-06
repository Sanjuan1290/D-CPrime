const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'documents',
  moduleName: 'Document Requirements',
  orderBy: '`name` ASC',
  filters: ['status'],
  columns: ['name', 'description', 'is_required', 'status'],
})
