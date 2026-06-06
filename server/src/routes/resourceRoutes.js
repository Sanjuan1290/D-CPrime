const express = require('express')

function resourceRoutes(controller, options = {}) {
  const router = express.Router()
  const writeMiddleware = options.writeMiddleware || []

  router.get('/', controller.list)
  if (controller.get) router.get('/:id', controller.get)
  if (controller.create) router.post('/', ...writeMiddleware, controller.create)
  if (controller.update) router.patch('/:id', ...writeMiddleware, controller.update)
  if (controller.remove) router.delete('/:id', ...writeMiddleware, controller.remove)

  return router
}

module.exports = resourceRoutes
