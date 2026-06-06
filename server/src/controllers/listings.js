const { createCrudController } = require('../utils/crud')

module.exports = createCrudController({
  table: 'listings',
  moduleName: 'Listings',
  orderBy: '`updated_at` DESC',
  filters: ['project_id', 'status'],
  columns: [
    'project_id',
    'cadastral_lot_no',
    'administrator_group',
    'unit_id',
    'reloc_unit_id',
    'lot_type',
    'lot_area_sqm',
    'new_area_sqm',
    'price_per_sqm',
    'net_selling_price',
    'legal_misc_rate',
    'legal_misc_fee',
    'total_contract_price',
    'reservation_fee',
    'promo_discount',
    'status',
  ],
})
