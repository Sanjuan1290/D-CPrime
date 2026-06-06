const express = require('express')
const requireRole = require('../middleware/requireRole')
const controller = require('../controllers/users')

const router = express.Router()
const adminOnly = requireRole('owner', 'admin')

router.get('/', controller.list)
router.get('/:id', controller.get)
router.post('/', adminOnly, controller.create)
router.patch('/:id', adminOnly, controller.update)
router.delete('/:id', adminOnly, controller.remove)

module.exports = router
