import { Card, Col, Tag, Button } from 'antd';
import './style.css';
import PropTypes from 'prop-types';

const { Meta } = Card;

const CardProduct = ({ product }) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    stock,
    thumbnail,
    slug,
  } = product;

  const discountedPrice = price - (price * discountPercentage) / 100;

  return (
    <Col span={8} style={{ marginBottom: 20 }}>
      <Card
        hoverable
        cover={<img className="card-product-thumbnail" alt={title} src={thumbnail} />}
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
        <div className="card-product-stock">
          In Stock: {stock}
        </div>
        <Button
          type="primary"
          href={`/product/${slug}`}
          className="card-product-button"
        >
          View Details
        </Button>
      </Card>
    </Col>
  );
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
