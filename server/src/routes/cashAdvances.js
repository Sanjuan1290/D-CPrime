const controller = require('../controllers/cashAdvances')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
