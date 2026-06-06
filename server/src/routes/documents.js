const controller = require('../controllers/documents')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
