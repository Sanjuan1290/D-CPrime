const controller = require('../controllers/reservations')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
