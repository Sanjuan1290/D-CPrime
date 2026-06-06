const controller = require('../controllers/projects')
const resourceRoutes = require('./resourceRoutes')

module.exports = resourceRoutes(controller)
