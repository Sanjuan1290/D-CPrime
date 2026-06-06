const controller = require('../controllers/documentRequirements')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
