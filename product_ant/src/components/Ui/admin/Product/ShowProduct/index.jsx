import { Card, Descriptions, Image, Typography, Tag, Space } from "antd";
import PropTypes from "prop-types";
import "./style.css";

const { Title, Text } = Typography;

/**
 * Component hiển thị chi tiết sản phẩm đẹp hơn ngay bên trong Drawer
 * @param {{ data: { title: string, price: number, stock: number, description: string, status: string, thumbnail: string, discountPercentage?: number, featured?: string | number } }} props
 */
const ShowProduct = ({ data }) => {
  if (!data) {
    return <Text type="secondary">Không có dữ liệu sản phẩm.</Text>;
  }

  const statusTag = () => {
    switch (data.status) {
      case "active":
        return <Tag color="green">Hoạt động</Tag>;
      case "inactive":
        return <Tag color="red">Dừng hoạt động</Tag>;
      default:
        return <Tag>{data.status}</Tag>;
    }
  };

  const featuredTag = () => {
    if (data.featured == null || data.featured === "0" || data.featured === 0) {
      return null;
    }
    return <Tag color="gold">Nổi bật</Tag>;
  };

  // Tính giá sau giảm giá nếu có
  const hasDiscount = data.discountPercentage != null && data.discountPercentage > 0;
  const formattedOriginalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.price);
  const discountedPrice = hasDiscount
    ? data.price * (1 - data.discountPercentage / 100)
    : data.price;
  const formattedDiscountedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(discountedPrice);

  return (
    <Card
      bordered
      hoverable
      bodyStyle={{ padding: "24px" }}
      className="show-product-card"
    >
      <div className="show-product-header">
        <Title level={4} ellipsis={{ tooltip: data.title }}>
          {data.title}
        </Title>
        <Space>
          {featuredTag()}
          {statusTag()}
        </Space>
      </div>

      <div className="show-product-content">
        <div className="show-product-image">
          {data.thumbnail && (
            <Image
              src={data.thumbnail}
              alt={data.title}
              width={240}
              style={{ borderRadius: "8px" }}
              placeholder
            />
          )}
        </div>

        <Descriptions column={1} bordered className="show-product-descriptions">
          <Descriptions.Item label="Giá bán">
            <div className="price-display">
              {hasDiscount ? (
                <>
                  <Text delete>{formattedOriginalPrice}</Text>
                  <Title level={5} className="price-text">
                    {formattedDiscountedPrice}
                  </Title>
                </>
              ) : (
                <Title level={5} className="price-text">
                  {formattedOriginalPrice}
                </Title>
              )}
            </div>
          </Descriptions.Item>

          {hasDiscount && (
            <Descriptions.Item label="Giảm giá">
              <Text type="danger">{`${data.discountPercentage}%`}</Text>
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Số lượng còn">
            <Text>{data.stock}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả">
            <div
              className="description-text"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Card>
  );
};

ShowProduct.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    description: PropTypes.string,
    status: PropTypes.string,
    thumbnail: PropTypes.string,
    discountPercentage: PropTypes.number,
    featured: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default ShowProduct;
