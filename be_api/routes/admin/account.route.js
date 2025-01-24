const express = require('express');
const multer = require('multer');
const router = express.Router();
// dung router thay cho app

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controllers/admin/account.controller");




module.exports = router;