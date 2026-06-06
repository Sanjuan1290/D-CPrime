const controller = require('../controllers/auditLogs')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
