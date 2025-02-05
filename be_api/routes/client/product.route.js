const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/client/product.controller");


router.get('/featured', controller.getProductsFeatured);

router.get('/findProductBySlug/:slugProduct', controller.findProductBySlug);

router.get('/filter', controller.filter);

router.get('/getProductsByCategoryId/:CategoryId', controller.getProductsByCategoryId);


module.exports = router