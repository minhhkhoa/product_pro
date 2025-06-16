import LayoutDefault from "../layout/LayoutDefault";
import Product from "../components/admin/Product";
import Category from "../components/admin/Category";
import CreateCategory from "../pages/admin/Category/Create";
import UpdateCategory from "../pages/admin/Category/Update";
import ListProductDeleted from "../pages/admin/Product/ListProductDeleted/ListProductDeleted";
import Role from "../components/admin/Role";
import PermissionsTable from "../components/admin/Permissions";
import Account from "../components/admin/Account";
import Login from "../components/admin/Auth/Login";
import DashBoard from "../components/admin/DashBoard";
import PrivateRoute from "../components/admin/PrivateRoute"; // Import PrivateRoute
import Setting from "../pages/admin/Setting";
import ClientLayout from "../layout/client/Layout";
import Home from "../components/client/Home";
import DetailProduct from "../components/client/DetailProduct";
import PageProducts from "../pages/client/PageProducts";
import Search from "../components/client/Search";
import Invoice from "../components/admin/Invoice";
import TableInvoice from "../components/admin/Invoice/TableInvoice";
import CreateProduct from "../components/Ui/admin/Product/CreateProduct.jsx";
import EditProduct from "../components/Ui/admin/Product/EditProduct.jsx/index.jsx";
import CreateAccount from "../components/Ui/admin/Account/CreateAccount/CreateAccount.jsx";
import EditAccount from "../components/Ui/admin/Account/EditAccount/index.jsx";

export const routes = [
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        {" "}
        {/* Bọc LayoutDefault để bảo vệ toàn bộ route con */}
        <LayoutDefault />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "products",
        element: <Product />,
      },
      {
        path: "products/createProduct",
        element: <CreateProduct />,
      },
      {
        path: "products/updateProduct/:id",
        element: <EditProduct />,
      },
      {
        path: "products-deleted",
        element: <ListProductDeleted />,
      },
      {
        path: "products-category",
        element: <Category />,
      },
      {
        path: "products-category/createCategory",
        element: <CreateCategory />,
      },
      {
        path: "products-category/updateCategory/:id",
        element: <UpdateCategory />,
      },
      {
        path: "roles",
        element: <Role />,
      },
      {
        path: "permissions",
        element: <PermissionsTable />,
      },
      {
        path: "invoice",
        element: <TableInvoice />,
      },
      {
        path: "invoice/createInvoice",
        element: <Invoice />,
      },
      {
        path: "accounts",
        element: <Account />,
      },
      {
        path: "account/create",
        element: <CreateAccount />,
      },
      {
        path: "account/updateAccount/:id",
        element: <EditAccount />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
    ],
  },
  {
    path: "/admin/auth/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "product/:slugProduct",
        element: <DetailProduct />,
      },
      {
        path: "products-category/:categoryId",
        element: <PageProducts />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
];
