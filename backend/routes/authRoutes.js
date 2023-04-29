const express = require('express')
const { getAuth } = require('../controllers/authController')

const router = express.Router()


router.get('/', getAuth)


module.exports = router 