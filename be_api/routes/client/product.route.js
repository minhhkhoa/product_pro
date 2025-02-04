const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/client/product.controller");


router.get('/featured', controller.getProductsFeatured);


module.exports = router