const controller = require('../controllers/clientUnits')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
