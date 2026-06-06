const controller = require('../controllers/payments')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
