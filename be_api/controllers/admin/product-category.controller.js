const ProductCategory = require("../../models/product-category.model")

module.exports.getCategoryById = async (req, res) => {
  const id = req.params.id;
  const data = await ProductCategory.findOne({
    deleted: false,
    _id: id
  }).select('-createdBy -updatedBy -updatedAt -createdAt')
    .lean(); // Loại bỏ các phương thức của Mongoose
  return res.json(data);
}

//[post]:/admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments({});
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    console.log(record);
    await record.save();
    
    return res.json("Thêm thành công");
}

//[patch]: /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  let updatedData = req.body;

  // Kiểm tra nếu không có ảnh mới thì giữ ảnh cũ
  if (!updatedData.thumbnail) {
    const currentCategory = await ProductCategory.findById(id);
    updatedData.thumbnail = currentCategory.thumbnail; // Giữ lại ảnh cũ nếu không có ảnh mới
  } else {
    // Nếu có ảnh mới, xử lý thêm ảnh mới vào dữ liệu
    // (Giả sử đã xử lý ảnh upload ở frontend)
  }

  updatedData.position = parseInt(updatedData.position);

  // Cập nhật dữ liệu vào cơ sở dữ liệu
  await ProductCategory.updateOne({ _id: id }, updatedData);

  return res.json("Cập nhật thành công");
};
