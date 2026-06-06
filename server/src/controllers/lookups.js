const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'app_features',
  moduleName: 'Lookups',
  orderBy: '`module_name` ASC, `display_name` ASC',
  columns: ['feature_key', 'module_name', 'display_name'],
})
