const Product = require("../../models/product.model");


module.exports.index = async (req, res) => {
  const products = Product.find({deleted: false});
  return res.json(products);
}