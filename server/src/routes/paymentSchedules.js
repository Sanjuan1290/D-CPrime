const controller = require('../controllers/paymentSchedules')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
