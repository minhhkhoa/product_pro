const Account = require("../../models/account.model")
const Role = require("../../models/role.model")


module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie

  if (!token) {
    return res.status(404).json({
      code: 404,
      message: "Bạn chưa đăng nhập"
    });
  }

  try {
    const user = await Account.findOne({ token: token }).select("-password");
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy user với token này"
      });
    }

    const role = await Role.findOne({ _id: user.role_id }).select("title permissions");
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy role cho user này"
      });
    }

    req.user = user; // Gán user vào request để sử dụng sau này
    next();
  } catch (err) {
    console.error("Lỗi xác thực:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi xác thực thông tin người dùng"
    });
  }
};

