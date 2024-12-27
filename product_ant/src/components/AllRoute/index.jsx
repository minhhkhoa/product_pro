import { useRoutes } from "react-router-dom";
import { routes } from "../../routes";

function AllRoute() {

  //- useRoutes sẽ convert obj router
  const elements = useRoutes(routes);
  return (
    <>
      {elements}
    </>
  )
}

export default AllRoute;