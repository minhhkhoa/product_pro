const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/admin/dashboard.controller");

router.get('/', controller.dashboard)

module.exports = router