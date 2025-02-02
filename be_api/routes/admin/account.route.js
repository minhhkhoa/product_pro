const express = require('express');
const multer = require('multer');
const router = express.Router();
// dung router thay cho app

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controllers/admin/account.controller");

router.get("/getAllAccount", controller.getAllAccount);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch(
  '/edit/:id',
  upload.single('avatar'),
  uploadCloud.upload,
  controller.editSuccess
)

router.post(
  '/create',
  upload.single('avatar'),
  uploadCloud.upload,
  controller.createPost)

// Route kiểm tra email đã tồn tại
router.get("/check-email", controller.checkEmailExists);

router.delete('/delete/:id', controller.deleteItem);



module.exports = router;