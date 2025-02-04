import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import CardProduct from '../CardProduct/index';
import { getProductsFeatured } from '../../../api/client/index';
import './style.css';

function Home() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      // Gọi API và nhận về dữ liệu sản phẩm
      const result = await getProductsFeatured();

      // Kiểm tra nếu gọi API thành công (ok: true)
      if (result.ok) {
        setProducts(result.data);  // Cập nhật state với dữ liệu sản phẩm
      } else {
        console.error("Error fetching products:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  console.log(products);

  return (
    <div className='featured-products-container'>
      <h1 className='title'>Sản phẩm nổi bật</h1>
      <section className='featured-products'>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product._id} span={6}>  {/* 4 sản phẩm mỗi hàng (24 / 4 = 6) */}
              <CardProduct product={product} />
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}

export default Home;
