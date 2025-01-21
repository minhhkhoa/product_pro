import LayoutDefault from '../layout/LayoutDefault';
import Product from '../components/Product';
import Category from '../components/Category';
import CreateCategory from '../pages/Category/Create';
import UpdateCategory from '../pages/Category/Update';

//-obj route
export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "products",
        element: <Product />
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
    ]
  }
]