const controller = require('../controllers/commissionReleases')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
