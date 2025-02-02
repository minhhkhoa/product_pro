const systemConfig = require("../../config/systems")
const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const categoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountsRoute = require("./account.route");
const authRoute = require("./auth.route");

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

  app.use(
    PATH_ADMIN + '/products-category',
    categoryRoute
  )

  app.use(
    PATH_ADMIN + '/roles',
    roleRoute
  )

  app.use(
    PATH_ADMIN + '/accounts',
    accountsRoute
  )

  app.use(
    PATH_ADMIN + '/auth',
    authRoute
  )
}