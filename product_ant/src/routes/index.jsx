import LayoutDefault from '../layout/LayoutDefault';
import Product from '../components/Product';
import Category from '../components/Category';
import CreateCategory from '../pages/Category/Create';

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
        children: [
          {
            path: "createCategory",
            element: <CreateCategory />
          },
        ]
      },
    ]
  }
]