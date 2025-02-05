import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dataCategoryById } from "../../../api/client";
import CardProduct from "../../../components/client/CardProduct";
import { Row, Col, Spin } from "antd";


function PageProducts() {
  const {categoryId} = useParams();
  const [dataProducts, setDataProducts] = useState();
  const [categoryName, setCategoryName] = useState(); 

  const fetchData = useCallback(async () => {
    const result = await dataCategoryById(categoryId);
    setDataProducts(result.data);
    setCategoryName(result.categoryName.title);
  }, [categoryId]);

  useEffect(() => {
    fetchData()
  }, [fetchData]);
  
  if(dataProducts && categoryName){
    return (
      <>
      <div className="sameProduct">
          <h1 className="title">{categoryName}</h1>
          <Row gutter={[16, 16]}>
            {dataProducts.map((product) => (
              <Col key={product._id} span={6}>  {/* 4 sản phẩm mỗi hàng (24 / 4 = 6) */}
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
      </div>
        
      </>
    )
  } else{
    return (
      <>
        <Spin className="spin"/>
      </>
    )
  }

}

export default PageProducts;