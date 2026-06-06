const controller = require('../controllers/commissions')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
