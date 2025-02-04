import { Card, Col, Tag, Button, InputNumber, Image } from 'antd';
import './style.css';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const { Meta } = Card;

const CardProduct = ({ product }) => {
  const { slug } = useParams();
  if (!product) {
    return <div>Loading...</div>;  // Hiển thị Loading nếu product chưa có dữ liệu
  } else {
    const {
      title,
      description,
      price,
      discountPercentage,
      stock,
      thumbnail,
    } = product;


    const discountedPrice = price - (price * discountPercentage) / 100;

    return (
      <Col span={8} style={{ marginBottom: 20 }}>
        <Card
          hoverable
          cover={
            <Image
              style={{ height: "200px", width: "200px", marginLeft: '30px'}}
              className="card-product-thumbnail"
              alt={title} src={thumbnail}
            />
          }
          className="card-product"
        >
          <Meta
            title={title}
            description={<p dangerouslySetInnerHTML={{ __html: description }} />}
          />
          <div className="card-product-price">
            <Tag color="red">{discountPercentage}% OFF</Tag>
            <div className="card-product-prices">
              <span className="original-price">${price}</span>
              <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
            </div>
          </div>
          {
            slug ?
              <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "5px" }}>
                <p>Số lượng mua</p>
                <InputNumber min={1} max={stock} defaultValue={1} />
              </div> :
              <div className="card-product-stock">
                In Stock: {stock}
              </div>
          }

          {
            slug ?
              <Button
                type="primary"
                // href={`/product/${slug}`}
                className="card-product-button"
              >
                Thêm vào giỏ
              </Button>
              : <Button
                type="primary"
                href={`/product/${slug}`}
                className="card-product-button"
              >
                View Details
              </Button>
          }
        </Card>
      </Col>
    );
  }
};

export default CardProduct;

CardProduct.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPercentage: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};
