const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: []
    },
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

const Role = mongoose.model('Role', roleSchema, "roles")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = Role