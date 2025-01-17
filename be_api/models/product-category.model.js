const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id:{
      type: String,
      //neu ko truyen du lieu thi nhan macdinh la ""
      default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
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

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category")
//  varriable                         ten bien model                               ten obj trong mongoo ko bawts buoc co
module.exports = ProductCategory