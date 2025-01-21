const express = require('express')
const multer = require('multer')
const router = express.Router()

const upload = multer()


const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const controller = require("../../controllers/admin/product-category.controller.js")

router.get(`/getCategoryById/:id`, controller.getCategoryById);

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  controller.createPost
)


router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.upload,
  controller.editPatch
)

// router.delete('/delete/:id', controller.deleteItem);


module.exports = router