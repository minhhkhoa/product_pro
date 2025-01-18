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
    const products = await Product.find(query).select([
      "thumbnail", "title", "price", "position", "status", "product_category_id"
    ]);

    return res.json(products);
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
    const updatedProducts = await Product.find(query).select([
      "thumbnail", "title", "price", "position", "status", "product_category_id"
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

module.exports.getCategory= async (req, res) => {
  try {
    const listCategories = await ProductCategory.find(
      {
        deleted: false
      }
    ).select([
      "_id", "title", "parent_id",
    ]);
    return res.json(listCategories);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports.createPost = async (req, res) => {

  req.body.title = req.body.title;
  req.body.product_category_id = req.body.product_category_id;
  req.body.featured = req.body.featured;
  req.body.description = req.body.description;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments({})
    req.body.position = countProducts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  req.body.status = req.body.status;


  //add product
  const product = new Product(req.body)
  console.log(product);
  // await product.save()
}

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  //-xóa mềm
  await Product.updateOne({ _id: id }, {
    deleted: true,
  })

  return res.json({ message: "Delete product successfully" });

}
