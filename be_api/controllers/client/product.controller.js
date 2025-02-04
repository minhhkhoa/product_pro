const Product = require("../../models/product.model")

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
  const slug = req.params.slug;
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