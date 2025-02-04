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

export const routes = [
  {
    path: "/admin",
    element: (
      <PrivateRoute> {/* Bọc LayoutDefault để bảo vệ toàn bộ route con */}
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
        path: "accounts",
        element: <Account />,
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
        element: <Home/>,
      }
    ],
  },
];
