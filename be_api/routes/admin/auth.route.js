const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/admin/auth.controller");

router.post(
  '/login',
  controller.loginPost)

// router.get('/logout', controller.logout)

module.exports = router