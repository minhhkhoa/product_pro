const Product = require("../../models/product.model");
const Category = require("../../models/product-category.model");

module.exports.getProductsFeatured = async (req, res) => {
  try {
    const products = await Product.find({
      featured: 1,
      status: "active"
    }).limit(16)
      .select("-createdAt -updatedAt -deletedBy -createdBy -updatedBy");
    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products: ', error);
  }
}

module.exports.findProductBySlug = async (req, res) => {
  const slug = req.params.slugProduct;
  try {
    const result = await Product.findOne({
      status: "active",
      deleted: false,
      slug: slug
    }).select("-createdAt -updatedAt -deletedBy -createdBy -updatedBy");
    if (!result) {
      return res.status(404).json({ message: 'Products not found' });
    } else{
      const category_id = result.product_category_id;

      const sameProduct = await Product.find({
        product_category_id: category_id,
        status: "active",
        deleted: false,
      }).select("-createdAt -updatedAt -deletedBy -createdBy -updatedBy");

      return res.status(200).json({
        product: result,
        sameProduct: sameProduct
      });
    }

  } catch (error) {
    console.error('Failed to fetch products: ', error);
  }
}

module.exports.filter = async (req, res) => {
  try {
    const { search, category } = req.query;  // Lấy category từ query string

    // Tạo query để tìm sản phẩm
    const query = {
      deleted: false,
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
}

module.exports.getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.CategoryId;
    
    const products = await Product.find({
      product_category_id: categoryId,
      status: "active",
      deleted: false
    }).select("-createdAt -updatedAt -deletedBy -createdBy -updatedBy");

    const categoryName = await Category.findById({_id: categoryId}).select("title");

    if(!products){
      return res.status(404).json({ message: 'Products not found' });
    }

    return res.status(200).json({
      data: products,
      categoryName
    })

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}