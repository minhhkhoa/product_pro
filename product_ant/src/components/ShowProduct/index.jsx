import { useState } from 'react';
import { Button, Modal, Typography, Space, Image } from 'antd';
import PropTypes from 'prop-types';
import './style.css'; // Đảm bảo bạn có tệp CSS

const { Title, Text } = Typography;

// eslint-disable-next-line react/prop-types
const ShowProduct = ({ typeTitle, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getButtonType = () => {
    switch (typeTitle) {
      case 'Chi tiết':
        return 'btn primary';
      case 'Xóa':
        return 'btn danger';
      case 'Sửa':
        return 'btn warning';
      default:
        return '';
    }
  };

  return (
    <>
      <Button
        type="default"
        className={getButtonType()}
        style={{ marginRight: '10px' }}
        onClick={showModal}
      >
        {typeTitle}
      </Button>

      <Modal
        title={`${typeTitle} sản phẩm`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}  // Tắt footer mặc định của Modal
        className="custom-modal"
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>{data.title}</Title>
            <Text strong>Giá:</Text> <Text>${data.price}</Text>
          </div>
          <div>
            <Text strong>Vị trí: </Text><Text>{data.position}</Text>
          </div>
          <div>
            <Text strong>Trạng thái: </Text><Text>{data.status}</Text>
          </div>
          <div className="modal-thumbnail">
            <Image
              src={data.thumbnail}
              alt={data.title}
              width={200}
              style={{ borderRadius: '8px' }}
            />
          </div>
        </Space>
      </Modal>
    </>
  );
};

// Định nghĩa kiểu `props` cho `ShowProduct`
ShowProduct.propTypes = {
  typeTitle: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,  // Dữ liệu sản phẩm
};

export default ShowProduct;
