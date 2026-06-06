const controller = require('../controllers/lookups')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
