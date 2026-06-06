const controller = require('../controllers/clients')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
