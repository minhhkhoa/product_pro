const express = require('express');
const multer = require('multer');
const router = express.Router();
// dung router thay cho app

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controllers/admin/account.controller");

router.get("/getAllAccount", controller.getAllAccount);

router.patch('/change-status/:status/:id', controller.changeStatus);


module.exports = router;