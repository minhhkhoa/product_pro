//- req và res được truyền sẵn rồi
module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề")
    res.redirect("back")
    return
  }
  next() //sang Bước kết tiếp là đi vào controller
}