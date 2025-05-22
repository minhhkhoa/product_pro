const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    // Auto-generated invoice number using date and ObjectId suffix
    invoice_number: {
      type: String,
      unique: true,
      default: function () {
        const datePart = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const idSuffix = this._id.toString().slice(-6).toUpperCase();
        return `INV${datePart}${idSuffix}`;
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    items: [
      {
        product_id: String,
        quantity: Number,
        unit_price: Number,
        discount: Number,
        line_total: Number,
      },
    ],
    sub_total: Number, //-Tổng tiền chưa giảm giá
    discount_total: Number, //-Tổng mức giảm giá áp dụng cho cả hóa đơn
    total_amount: Number, //-Số tiền cuối cùng khách phải trả:
    createdBy: {
      account_id: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: { //- flag xoa
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      timestamp: Date,
    },
    updatedBy: [
      {
        account_id: String,
        timestamp: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema, "invoices");
module.exports = Invoice;
