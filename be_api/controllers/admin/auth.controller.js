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
    httpOnly: true,   // Bảo mật hơn (chỉ có backend đọc được)
    secure: false,    // Để false nếu test trên HTTP, true nếu dùng HTTPS
    sameSite: "Lax",  // Cho phép gửi cookie giữa các domain
    maxAge: 24 * 60 * 60 * 1000 // Cookie hết hạn sau 24 giờ
  });


  //-login success
  return res.json({
    code: 3,
    message: "Đăng nhập thành công!",
    token: user.token
  })
}

//[get]: /admin/auth/logout
// module.exports.logout = (req, res) => {
//   //-xoa token trong cookie
//   res.clearCookie("token")
//   res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
// }