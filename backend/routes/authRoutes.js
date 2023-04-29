const express = require('express')
const { getAuth, register, login } = require('../controllers/authController')

const router = express.Router()


router.get('/', getAuth)
router.post('/register', register)
router.post('/login', login)



module.exports = router 