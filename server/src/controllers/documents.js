const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'client_unit_documents',
  moduleName: 'Documents',
  orderBy: '`updated_at` DESC',
  filters: ['client_unit_id', 'document_id', 'status'],
  columns: ['client_unit_id', 'document_id', 'file_url', 'file_public_id', 'status', 'reviewed_by', 'reviewed_at'],
})
