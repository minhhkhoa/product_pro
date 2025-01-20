const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

module.exports.index = async (req, res) => {
  try {
    const { status, search, category } = req.query;  // Lấy category từ query string

    // Tạo query để tìm sản phẩm
    const query = {
      deleted: false,
      ...(status && status !== "all" && { status }),  // Nếu status !== "all", thêm vào query
      ...(search && { title: { $regex: search, $options: 'i' } }), // Nếu có search, tìm theo title
      ...(category && { product_category_id: category }), // Nếu có category, lọc theo categoryId
    };

    // Tìm các sản phẩm theo query
    const products = await Product.find(query).select("-createdBy -updatedBy -updatedAt -createdAt");

    const reverseData = products.reverse();

    return res.json(reverseData);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
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
    const updatedProducts = await Product.find(query).select("-createdBy -updatedBy -updatedAt -createdAt");

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

module.exports.getCategory= async (req, res) => {
  try {
    const listCategories = await ProductCategory.find(
      {
        deleted: false
      }
    ).select("-createdBy -updatedBy -updatedAt -createdAt");
    return res.json(listCategories);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments({})
    req.body.position = countProducts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  //add product
  const product = new Product(req.body)
  await product.save();
  return res.json({ message: "Create product successfully" });
}

module.exports.editSuccess = async (req, res) => {
  const id = req.params.id;

  // Kiểm tra và ép kiểu các giá trị sang kiểu số nếu có
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {

    // Cập nhật thông tin sản phẩm
    const updatedProduct = await Product.updateOne(
      { _id: id }, // Điều kiện tìm sản phẩm theo id
      {
        ...req.body,   // Các thông tin cần cập nhật
      }
    );

    if (updatedProduct.nModified === 0) {
      return res.status(400).json({ message: "No changes were made to the product." });
    }

    return res.json({ message: "Product updated successfully." });
  } catch (error) {
    console.error(error);  // Ghi log lỗi để tiện theo dõi
    return res.status(500).json({ message: "Failed to update product." });
  }
};


module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  //-xóa mềm
  await Product.updateOne({ _id: id }, {
    deleted: true,
  })

  return res.json({ message: "Delete product successfully" });

}
