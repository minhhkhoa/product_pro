import { useState } from 'react';
import { Button, Modal } from 'antd';
import "./style.css";
import PropTypes from 'prop-types';

const ShowProduct = ({ typeTitle, id }) => {

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
        return "btn primary";
      case 'Xóa':
        return "btn danger";
      case 'Sửa':
        return "btn warning";
      default:
        return "";
    }
  };

  return (
    <>
      <Button type="default" className={getButtonType()} style={{ marginRight: "10px" }} onClick={showModal}>
        {typeTitle}
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>{id}</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

// Định nghĩa kiểu `props` cho `ShowProduct` 
ShowProduct.propTypes = {
  typeTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ShowProduct;
