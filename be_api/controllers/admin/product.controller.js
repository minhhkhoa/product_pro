const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const { status, search } = req.query;  // Lấy status và search từ query string (nếu có)

    // Tạo query để tìm sản phẩm
    const query = {
      deleted: false,
      ...(status && status !== "all" && { status }), // Nếu status !== "all", thêm vào query
      ...(search && { title: { $regex: search, $options: 'i' } }), // Nếu có search, tìm theo title
    };

    // Tìm các sản phẩm theo query
    const products = await Product.find(query).select([
      "thumbnail", "title", "price", "position", "status",
    ]);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    // Cập nhật trạng thái sản phẩm
    await Product.updateOne({ _id: id }, { status });

    // Lấy các query params từ request (để giữ điều kiện lọc)
    const { status: filterStatus, search } = req.query;

    // Tạo query để lấy lại sản phẩm với điều kiện lọc hiện tại
    const query = {
      deleted: false,
      ...(filterStatus && filterStatus !== "all" && { status: filterStatus }),
      ...(search && { title: { $regex: search, $options: 'i' } }), // Tìm theo search nếu có
    };

    // Lấy danh sách sản phẩm mới nhất từ DB với điều kiện lọc
    const updatedProducts = await Product.find(query).select([
      "thumbnail", "title", "price", "position", "status",
    ]);

    // Trả về danh sách sản phẩm đã được cập nhật
    return res.json(updatedProducts);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.changePosition = async (req, res) => {
  try {
    const { position, id } = req.params;

    // Cập nhật trạng thái sản phẩm
    await Product.updateOne({ _id: id }, { position });

    return res.json({ message: "Position updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  //-xóa mềm
  await Product.updateOne({ _id: id }, {
    deleted: true,
  })

  return res.json({ message: "Delete product successfully" });

}
