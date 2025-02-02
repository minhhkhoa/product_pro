const systemConfig = require("../../config/systems")
const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const categoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountsRoute = require("./account.route");
const authRoute = require("./auth.route");

const middleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin

  app.use(
    PATH_ADMIN + '/dashboard',
    middleware.requireAuth,
    dashboardRouters
  )

  app.use(
    PATH_ADMIN + '/products',
    middleware.requireAuth,
    productRouters
  )

  app.use(
    PATH_ADMIN + '/products-category',
    middleware.requireAuth,
    categoryRoute
  )

  app.use(
    PATH_ADMIN + '/roles',
    middleware.requireAuth,
    roleRoute
  )

  app.use(
    PATH_ADMIN + '/accounts',
    middleware.requireAuth,
    accountsRoute
  )

  app.use(
    PATH_ADMIN + '/auth',
    authRoute
  )
}