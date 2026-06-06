const express = require('express')
const controller = require('../controllers/soa')

const router = express.Router()

router.get('/:clientUnitId', controller.getByClientUnit)

module.exports = router
