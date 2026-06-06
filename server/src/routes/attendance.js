const express = require('express')
const requireRole = require('../middleware/requireRole')
const controller = require('../controllers/attendance')

const router = express.Router()
const attendanceAdmins = requireRole('owner', 'admin', 'manager', 'treasury')

router.get('/today', controller.today)
router.get('/', controller.list)
router.post('/scan', attendanceAdmins, controller.scan)
router.patch('/:id', requireRole('owner', 'admin'), controller.update)

module.exports = router
