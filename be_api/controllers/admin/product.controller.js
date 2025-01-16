const Product = require("../../models/product.model");


module.exports.index = async (req, res) => {
  try {
    const products = await Product.find(
      {
        deleted: false
      }).select(
        [
          "thumbnail",
          "title",
          "price",
          "position",
          "status",
        ]
    );
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    // Cập nhật trạng thái sản phẩm
    await Product.updateOne({ _id: id }, { status });

    // Lấy danh sách sản phẩm mới nhất từ DB
    const updatedProducts = await Product.find({ deleted: false }).select([
      "thumbnail",
      "title",
      "price",
      "position",
      "status",
    ]);

    // Trả về dữ liệu sản phẩm mới nhất
    return res.json(updatedProducts);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
