const Account = require("../../models/account.model")
const Role = require("../../models/role.model")


module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  console.log(token);

  if (!token) {
    console.log("Bạn chưa đăng nhập")
    return res.status(404).json({
      code: 404,
      message: "Bạn chưa đăng nhập"
    });
  }

  try {
    // Tìm user theo token
    const user = await Account.findOne({ token: token }).select("-password");
    if (!user) {
      console.log("Không tìm thấy user với token này")
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy user với token này"
      });
    }

    // Tìm role của user
    const role = await Role.findOne({ _id: user.role_id }).select("title permissions");
    if (!role) {
      console.log("Không tìm thấy role cho user này")
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy role cho user này"
      });
    }

    // Tiếp tục xử lý request
    next();

  } catch (err) {
    console.error("Lỗi khi xác thực người dùng: ", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi xác thực thông tin người dùng"
    });
  }
};
