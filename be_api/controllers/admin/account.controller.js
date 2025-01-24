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
