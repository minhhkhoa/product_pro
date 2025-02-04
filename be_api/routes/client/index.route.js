const productRouters = require("./product.route");

//- Nhungs file home
module.exports = (app) => {

//- Nhungs file products
  app.use(
    '/products',
    productRouters)
  
}