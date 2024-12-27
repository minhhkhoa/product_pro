import LayoutDefault from '../layout/LayoutDefault';
import Product from '../components/Product';

//-obj route
export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Product/>
      },
    ]
  }
]