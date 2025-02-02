const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
var md5 = require('md5') //-mã hóa mật khẩu của account
const systemConfig = require("../../config/systems")

//[post]: /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await Account.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    res.json({
      code: 0,
      message: "Email không tồn tại!"
    })
    return
  }

  if (md5(password) != user.password) {
    res.json({
      code: 1,
      message: "Mật khẩu không chính xác!"
    })
    return
  }

  if (user.status == "inactive") {
    res.json({
      code: 2,
      message: "Tài khoản đã bị khóa!",
    })
    return
  }

  res.cookie("token", user.token, {
    httpOnly: true,   // Bảo mật hơn (chỉ có backend đọc được khi là true)
    secure: true,    // Để false nếu test trên HTTP, true nếu dùng HTTPS
    sameSite: "None",  // Cho phép gửi cookie giữa các domain khác nhau đi với secure: true
    maxAge: 24 * 60 * 60 * 1000 // Cookie hết hạn sau 24 giờ
  });


  //-login success
  return res.json({
    code: 3,
    message: "Đăng nhập thành công!",
    token: user.token
  })
}

// [GET]: /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token"); // 🔥 Xóa cookie token
  res.json({ message: "Đăng xuất thành công!" });
};

// [GET]: /admin/auth/info
module.exports.info = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ message: "Token không tồn tại!" });
  }

  try {
    // Tìm user theo token
    const user = await Account.findOne({ token: token });
    if (!user) {
      return res.json({ message: "Không tìm thấy user!" });
    }

    // Tìm role của user
    const role = await Role.findOne({ _id: user.role_id });
    if (!role) {
      return res.json({ message: "Không tìm thấy role!" });
    }

    // Trả về thông tin user và role
    return res.json({
      message: "Thông tin user:",
      user: {
        email: user.email,
        fullName: user.fullName,
        role: role.title,
      },
    });
  } catch (err) {
    // Xử lý lỗi nếu có
    return res.json({ message: "Lỗi lấy thông tin!" });
  }
};
