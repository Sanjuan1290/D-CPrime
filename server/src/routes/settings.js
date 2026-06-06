const controller = require('../controllers/settings')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
