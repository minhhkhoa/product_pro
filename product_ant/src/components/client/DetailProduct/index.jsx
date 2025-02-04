import { useState, useEffect, useCallback } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import { findProductBySlug } from "../../../api/client";
import CardProduct from "../CardProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function DetailProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState();
  const [sameProducts, setSameProducts] = useState();

  const getProduct = useCallback(async () => {
    try {
      const result = await findProductBySlug(slug);
      if (result.ok) {
        setProduct(result.data);
        const sameProduct = result.sameProduct.filter((item) => item._id !== result.data._id);
        setSameProducts(sameProduct);
      } else {
        console.error("Error fetching products:", result.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  }, [slug]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  if (product && sameProducts) {
    return (
      <>
        <div className="container">
          <CardProduct product={product} />
        </div>

        <div className="sameProduct">
          <h2>Các sản phẩm liên quan</h2>

          <div className="swiper">
            <Swiper
              className="swiper-container"
              modules={[Navigation]}
              navigation={true} // Kích hoạt nút điều hướng
              slidesPerView={5}
              spaceBetween={16}
              loop={false}
            >
              <div className="slice">
                {sameProducts.map((item) => (
                  <SwiperSlide key={item._id}>
                    <CardProduct product={item} />
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </div>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default DetailProduct;
