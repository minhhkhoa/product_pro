const express = require('express');
const router = express.Router();

const multer = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
const upload = multer()


const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate")


router.get("/", controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-position/:position/:id', controller.changePosition);

router.get("/getCategory", controller.getCategory);

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
)

router.delete('/delete/:id', controller.deleteItem);


module.exports = router;