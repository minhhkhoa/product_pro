const mongoose = require('mongoose')

module.exports.connect = async () => {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/product-management")
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Kết nối thành công')
  } catch (error) {
    console.log('kết nối thất bại')
    console.log(error)
  }
}
