import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons'; // Thêm import icon
const { Option } = Select;
import { Editor } from '@tinymce/tinymce-react';
import "./style.css";
import Notification from '../../../../utils/Notification';

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);


// eslint-disable-next-line react/prop-types
function CreateProduct({ onProductCreated }) {

  const [dataCategory, setDataCategory] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form] = Form.useForm();

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
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

    if (fileList.length > 0) {
      formData.append('thumbnail', fileList[0].originFileObj); // Chỉ gửi ảnh đầu tiên
    }

    // Duyệt qua FormData và in ra dữ liệu
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    try {
      const res = await fetch("http://localhost:3000/admin/products/create", {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        if (onProductCreated) onProductCreated(); // Gọi callback để load lại dữ liệu
        form.resetFields(); // Reset form
        setFileList([]); // Reset fileList
        setEditorContent(''); // Reset nội dung Editor
        Notification("success", "Thành công", "Sản phẩm đã được thêm thành công!");
      } else {
        Notification("error", "Lỗi", "Đã có lỗi xảy ra khi tạo sản phẩm!");
      }
    } catch (error) {
      console.log('Đã có lỗi xảy ra!', error);
      Notification("error", "Lỗi", "Đã có lỗi xảy ra khi tạo sản phẩm!");
    }
  };

  // Xử lý thay đổi ảnh upload
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // Hiển thị ảnh preview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Chuyển file sang Base64 để hiển thị preview
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <Button type="primary" onClick={showModal} className="btnCreate">
        <PlusOutlined />
        Thêm sản phẩm
      </Button>
      <Modal
        title="Thêm sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="create-product"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active', // Đặt giá trị mặc định cho status
            featured: '0' // Đặt giá trị mặc định cho featured
          }}>
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
            <Radio.Group defaultValue="0">
              <Radio value="1"> Có </Radio>
              <Radio value="0"> Không </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Editor
              apiKey="tlv55er0rp1owbi1sqrk0s9ha1v7xxnbir624071vyp33l2h"
              onEditorChange={(newValue) => setEditorContent(newValue)}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
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

          {/* Phần chọn ảnh và hiển thị preview */}
          <Form.Item label="Ảnh sản phẩm" name="thumbnail">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false} // Chặn việc upload ngay khi chọn file
            >
              {fileList.length < 1 && uploadButton}
            </Upload>
            {previewOpen && (
              <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            )}
          </Form.Item>

          {/* vị trí */}
          <Form.Item
            label="Vị trí"
            name="position"
            rules={[{ required: false, message: 'Vui lòng nhập vị trí!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder={'Tự động tăng nếu bỏ trống'} />
          </Form.Item>

          {/* trạng thái */}
          <Form.Item label="Trạng thái" name="status">
            <Radio.Group defaultValue="active">
              <Radio value="active"> Hoạt động </Radio>
              <Radio value="inactive"> Dừng hoạt động </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateProduct;
