const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status:String,
    deleted: {
      type: Boolean,
      //neu ko truyen du lieu thi nhan macdinh la false
      default: false
    },
    deletedAt: Date
  },
  //tham so thu 2
  {
    timestamps: true
  })

const Account = mongoose.model('Account', accountSchema, "accounts")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = Account