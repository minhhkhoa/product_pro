const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/invoice.controller");

router.get("/getAllInvoice", controller.getAllInvoice);

router.get("/:id", controller.getInvoiceById);

router.post(
  '/createInvoice',
  controller.createPost
)

router.delete('/deleteInvoice/:id', controller.deleteInvoice);



module.exports = router;