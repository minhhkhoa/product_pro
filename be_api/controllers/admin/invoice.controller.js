const Invoice = require("../../models/invoice.model");
const mongoose = require("mongoose");

module.exports.getAllInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find({ deleted: false }).sort({
      createdAt: -1,
    });
    const reverseData = invoices.reverse();

    return res.status(200).json(reverseData);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách hóa đơn" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { items = [], discount_total = 0, createdBy } = req.body;

    if (!items.length) {
      return res.status(400).json({ message: "Invoice must contain items." });
    }

    // Tính toán line_total cho từng sản phẩm
    const itemsWithLineTotal = items.map((item) => {
      const { unit_price = 0, quantity = 0, discount = 0 } = item;
      const line_total = unit_price * quantity * (1 - discount / 100);
      return {
        ...item,
        line_total: parseFloat(line_total.toFixed(2)),
      };
    });

    // Tổng cộng
    const sub_total = itemsWithLineTotal.reduce(
      (sum, item) => sum + item.line_total,
      0
    );
    const total_amount = sub_total * (1 - discount_total / 100);

    const invoice = await Invoice.create({
      items: itemsWithLineTotal,
      sub_total: parseFloat(sub_total.toFixed(2)),
      discount_total: parseFloat(discount_total),
      total_amount: parseFloat(total_amount.toFixed(2)),
      createdBy,
    });

    return res
      .status(201)
      .json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Create invoice error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findOne({
      invoice_number: id,
      deleted: false,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findOne({
      invoice_number: id,
      deleted: false,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // Đánh dấu là đã xóa
    invoice.deleted = true;

    await invoice.save();

    return res.json({ message: "Đã xóa hóa đơn thành công" });
  } catch (err) {
    console.error("Lỗi xoá hóa đơn:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xoá hóa đơn" });
  }
};
