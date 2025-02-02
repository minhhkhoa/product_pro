const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
var md5 = require('md5') //-mã hóa mật khẩu của account

module.exports.getAllAccount = async (req, res) => {
  try{
    const accounts = await Account.find({
      deleted: false
    }).select("-password -token -createdAt -updatedAt").lean();
    
    for (const account of accounts){
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false
      }).select("-createdAt -updatedAt -description")
      if (role){
        account.role = role
      }
      //-thêm key role cho obj
    }

    return res.json(accounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get Account" });
  }
}

module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    // Cập nhật trạng thái sản phẩm
    await Account.updateOne({ _id: id }, { status });

    return res.json({message: "success"});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  //-xóa mềm
  await Account.updateOne({ _id: id }, {
    deleted: true,
  })

  return res.json({ message: "Delete account successfully" });
}


module.exports.editSuccess = async (req, res) => {
  const id = req.params.id; // ID của tài khoản cần sửa
  try {
    // Kiểm tra xem email đã tồn tại trong hệ thống chưa (ngoại trừ tài khoản đang sửa)
    const emailExists = await Account.findOne({
      _id: { $ne: id }, // Loại trừ tài khoản đang chỉnh sửa
      email: req.body.email,
      deleted: false
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Nếu có mật khẩu mới, mã hóa nó, nếu không thì xóa khỏi req.body
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    // Cập nhật thông tin tài khoản
    const updatedAccount = await Account.updateOne({ _id: id }, req.body);

    if (updatedAccount.nModified === 0) {
      return res.status(400).json({ message: "Không có thay đổi nào được thực hiện." });
    }

    return res.json({ message: "Cập nhật tài khoản thành công." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi cập nhật tài khoản." });
  }
};

