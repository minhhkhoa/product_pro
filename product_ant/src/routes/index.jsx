import LayoutDefault from '../layout/LayoutDefault';
import Product from '../components/admin/Product';
import Category from '../components/admin/Category';
import CreateCategory from '../pages/Category/Create';
import UpdateCategory from '../pages/Category/Update';
import ListProductDeleted from '../pages/Product/ListProductDeleted/ListProductDeleted';
import Role from '../components/admin/Role';
import PermissionsTable from '../components/admin/Permissions';

//-obj route
export const routes = [
  {
    path: "/admin",
    element: <LayoutDefault />,
    children: [
      {
        path: "products",
        element: <Product />
      },
      {
        path: "products-deleted",
        element: <ListProductDeleted />
      },
      {
        path: "products-category",
        element: <Category />,
      },
      {
        path: "products-category/createCategory",
        element: <CreateCategory />
      },
      {
        path: "products-category/updateCategory/:id",
        element: <UpdateCategory />
      },
      {
        path: "roles",
        element: <Role />
      },
      {
        path: "permissions",
        element: <PermissionsTable/>
      },
      {
        path: "accounts",
        element: <PermissionsTable/>
      },
    ]
  }
]