const controller = require('../controllers/listings')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
