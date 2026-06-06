const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'system_settings',
  moduleName: 'Settings',
  orderBy: '`module_group` ASC, `setting_key` ASC',
  columns: ['setting_key', 'setting_value', 'module_group', 'updated_by'],
})
