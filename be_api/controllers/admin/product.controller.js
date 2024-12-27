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