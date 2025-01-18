import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  message,
  Upload,
  notification
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { Editor } from '@tinymce/tinymce-react';
import "./style.css";
import PropTypes from 'prop-types';

const Context = React.createContext({
  name: "Default",
});


const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);

// eslint-disable-next-line react/prop-types
function EditProduct({ typeTitle, data, onProductCreated  }) {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description) => {
    api.info({
      message,
      description,
      placement: "topRight",
    });
  };

  const [dataCategory, setDataCategory] = useState([]);
  const [editorContent, setEditorContent] = useState(data?.description || ''); // Mô tả từ props
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch dữ liệu danh mục sản phẩm
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/products/getCategory");
      const result = await res.json();
      setDataCategory(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // Load ảnh ban đầu vào fileList nếu có
    if (data?.thumbnail) {
      setFileList([
        {
          uid: '-1',
          name: 'thumbnail.png',
          status: 'done',
          url: data.thumbnail,
        },
      ]);
    }
  }, [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Xử lý form submit
  const onFinish = async (values) => {
    values.description = editorContent;
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('product_category_id', values.product_category_id);
    formData.append('featured', values.featured);
    formData.append('description', editorContent);
    formData.append('price', values.price);
    formData.append('discountPercentage', values.discountPercentage);
    formData.append('stock', values.stock);
    formData.append('position', values.position || "");
    formData.append('status', values.status);

    if (fileList.length > 0 && fileList[0]?.originFileObj) {
      formData.append('thumbnail', fileList[0].originFileObj);
    }

    try {
      const res = await fetch(`http://localhost:3000/admin/products/edit/${data._id}`, {
        method: 'PATCH', // Sử dụng PATCH cho cập nhật
        body: formData,
      });
      if (res.ok) {
        if (onProductCreated) onProductCreated(); // Gọi callback để load lại dữ liệu
        form.resetFields(); // Reset form
        setFileList([]); // Reset fileList
        setEditorContent(''); // Reset nội dung Editor
        openNotification("Thành công", "Sản phẩm đã được thêm thành công!");
      } else {
        message.error('Đã có lỗi xảy ra khi cập nhật sản phẩm!');
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra!', error);
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {typeTitle}
      </Button>
      <Modal
        title={typeTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="edit-product"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            title: data?.title || '',
            product_category_id: data?.product_category_id || '',
            featured: data?.featured || '0',
            price: data?.price || '',
            discountPercentage: data?.discountPercentage || '',
            stock: data?.stock || '',
            position: data?.position || '',
            status: data?.status || 'active',
          }}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="product_category_id"
            label="Danh mục sản phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select allowClear>
              {dataCategory.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Đặt làm nổi bật" name="featured">
            <Radio.Group>
              <Radio value="1"> Có </Radio>
              <Radio value="0"> Không </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Editor
              apiKey="tlv55er0rp1owbi1sqrk0s9ha1v7xxnbir624071vyp33l2h"
              value={editorContent}
              onEditorChange={(newValue) => setEditorContent(newValue)}
              init={{
                plugins:
                  'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
              initialValue={data.description}
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Phần trăm giảm giá" name="discountPercentage">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="stock"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Ảnh sản phẩm" name="thumbnail">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length < 1 && uploadButton}
            </Upload>
            {previewOpen && (
              <Modal
                open={previewOpen}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              </Modal>
            )}
          </Form.Item>

          <Form.Item
            label="Vị trí"
            name="position"
            rules={[{ required: false, message: 'Vui lòng nhập vị trí!' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder={'Tự động tăng nếu bỏ trống'}
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Radio.Group>
              <Radio value="active"> Hoạt động </Radio>
              <Radio value="inactive"> Dừng hoạt động </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      <Context.Provider value={{ name: "Ant Design" }}>
        {contextHolder}
      </Context.Provider>
    </>
  );
}

export default EditProduct;

EditProduct.propTypes = {
  typeTitle: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,  // Dữ liệu sản phẩm
};
