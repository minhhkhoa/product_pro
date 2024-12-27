const systemConfig = require("../../config/systems")
const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin

  app.use(
    PATH_ADMIN + '/dashboard',
    dashboardRouters
  )

  app.use(
    PATH_ADMIN + '/products',
    productRouters
  )
}