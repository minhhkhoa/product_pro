import { useParams } from "react-router-dom";

function PageProducts() {
  const {categoryId} = useParams();
  console.log(categoryId)
  return (
    <>
      this is pageProducts
    </>
  )
}

export default PageProducts;