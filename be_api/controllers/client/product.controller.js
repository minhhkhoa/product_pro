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
