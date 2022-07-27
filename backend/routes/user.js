const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.route('/balance').get(userController.getUserBalance)
router.route('/history').get(userController.getUserTransactionHistory)
router.route('/').get(userController.getUserNames)


module.exports = router