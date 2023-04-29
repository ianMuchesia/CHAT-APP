const express = require('express')
const getMessage = require('../controllers/messageController')

const router = express.Router()

router.get("/", getMessage)



module.exports = router