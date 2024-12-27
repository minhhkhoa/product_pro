const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    slug: { 
      type: String,
      slug: "title",
      unique: true
    },
    createdBy:{
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    
    deleted: {
      type: Boolean,
      //neu ko truyen du lieu thi nhan macdinh la false
      default:false
    },
    // deletedAt: Date,
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ],
  },
  //tham so thu 2
  {
    timestamps: true
  })

const Product = mongoose.model('Product', productSchema, "products")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = Product