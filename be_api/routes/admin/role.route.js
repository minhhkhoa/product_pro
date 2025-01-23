const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/admin/role.controller.js")


router.get("/getAllRole", controller.getAllRole);

router.post('/create', controller.createPost);

router.delete('/delete/:id', controller.deleteRole);

router.patch('/edit/:id', controller.editPatch);

module.exports = router