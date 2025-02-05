import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { searchProduct } from "../../../api/client";
import CardProduct from "../CardProduct";
import { Spin, Row, Col } from "antd";

function Search() {

  const [dataProduct, seatDataProduct] = useState();


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get("search");

  const fetchData = useCallback(async () => {
    const result = await searchProduct(query);
    if (result) {
      seatDataProduct(result);

    } else {
      console.log("error when fetch api");
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(dataProduct)

  if (dataProduct) {
    if(dataProduct.length === 0){
      return (
        <>
          <h1>Không có kết quả trùng khớp</h1>
        </>
      )
    }else{
          return (
      <>
        <div className="sameProduct">
          <h1 className="title">Result</h1>
          <Row gutter={[16, 16]}>
            {dataProduct.map((product) => (
              <Col key={product._id} span={6}>  {/* 4 sản phẩm mỗi hàng (24 / 4 = 6) */}
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
    }

  } else {
    return (
      <>
        <Spin className="spin" />
      </>
    );
  }
}

export default Search;