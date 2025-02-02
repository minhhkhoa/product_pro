const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
var md5 = require('md5') //-mã hóa mật khẩu của account

//[post]: /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    return res.json({
      code: 0,
      message: "Email không tồn tại!",
    });
  }

  if (md5(password) !== user.password) {
    return res.json({
      code: 1,
      message: "Mật khẩu không chính xác!",
    });
  }

  if (user.status === "inactive") {
    return res.json({
      code: 2,
      message: "Tài khoản đã bị khóa!",
    });
  }
  // Thiết lập cookie cho token
  res.cookie("token", user.token, {
    httpOnly: false,   // Bảo mật hơn (chỉ backend có thể đọc cookie)
    secure: true,    // Nếu chạy trên HTTP, set là false (để trên HTTPS, set là true)
    sameSite: "None", // Cần thiết cho việc chia sẻ cookie giữa các domain
    maxAge: 24 * 60 * 60 * 1000, // Cookie hết hạn sau 24 giờ
  });

  // Login thành công
  return res.json({
    code: 3,
    message: "Đăng nhập thành công!",
    token: user.token, // Nếu cần thiết, có thể trả lại token cho frontend
  });
};


// [GET]: /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token"); // 🔥 Xóa cookie token
  res.json({ message: "Đăng xuất thành công!" });
};

// [GET]: /admin/auth/info
module.exports.info = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token không tồn tại!" }); // Trả về 401 nếu không có token
  }

  try {
    // Tìm user theo token
    const user = await Account.findOne({ token: token });
    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy user!" }); // Trả về 401 nếu không tìm thấy user
    }

    // Tìm role của user
    const role = await Role.findOne({ _id: user.role_id });
    if (!role) {
      return res.status(401).json({ message: "Không tìm thấy role!" }); // Trả về 401 nếu không tìm thấy role
    }

    // Trả về thông tin user và role
    return res.status(200).json({
      message: "Thông tin user:",
      user: {
        email: user.email,
        fullName: user.fullName,
        role: role.title,
      },
    });
  } catch (err) {
    // Xử lý lỗi nếu có
    return res.status(500).json({ message: "Lỗi lấy thông tin!" }); // Trả về 500 nếu có lỗi hệ thống
  }
};

