import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Upload,
  Button,
  Divider,
  Card,
  Spin
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import './style.css'; // Import file CSS tùy chỉnh
import Notification from '../../../../utils/Notification';
import { getDataCategory, createItem } from '../../../../api/admin/index';

const { Option } = Select;

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);

function CreateCategory() {
  const [form] = Form.useForm();

  const [dataCategory, setDataCategory] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const [loading, setLoading] = useState(false);//-muc dich de hien spin khi dang tao danh muc


  const fetchData = async () => {
    try {
      const categoryData = await getDataCategory("flat"); // Chờ dữ liệu trả về
      setDataCategory(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values) => {
    values.description = editorContent;

    // Tạo formData và thêm dữ liệu
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('parent_id', values.parent_id);
    formData.append('description', editorContent);
    formData.append('position', values.position || '');
    formData.append('status', values.status);

    if (fileList.length > 0) {
      formData.append('thumbnail', fileList[0].originFileObj);
    }

    try {
      await createItem(formData, setLoading, "products-category");
      form.resetFields(); // Reset form
      setFileList([]); // Reset fileList
      setEditorContent(''); // Reset nội dung Editor
    } catch (error) {
      console.log('Đã có lỗi xảy ra!', error);
      Notification("error", "Lỗi", "Đã có lỗi xảy ra khi tạo danh mục sản phẩm!");
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
      <h1 className='namePage'>Thêm Danh Mục Sản Phẩm</h1>

      <Card bordered={false} className="form-container">
        <Form
          form={form}
          layout="vertical"
          name="create-category"
          onFinish={onFinish}
          initialValues={{ status: 'active' }}
        >
          <Divider orientation="left">Thông tin cơ bản</Divider>

          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục sản phẩm" />
          </Form.Item>

          <Form.Item
            name="parent_id"
            label="Danh mục cha"
          // rules={[{ required: true, message: 'Vui lòng chọn danh mục cha!' }]}
          >
            <Select allowClear placeholder="Chọn danh mục cha">
              <Option key="none" value="">
                Danh mục mới
              </Option>
              {dataCategory.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả">
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
            />
          </Form.Item>

          <Divider orientation="left">Hình ảnh</Divider>

          <Form.Item label="Ảnh danh mục">
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
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            )}
          </Form.Item>

          <Divider orientation="left">Cài đặt nâng cao</Divider>

          <Form.Item label="Vị trí" name="position">
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Tự động tăng nếu để trống"
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Radio.Group>
              <Radio value="active">Hoạt động</Radio>
              <Radio value="inactive">Dừng hoạt động</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm Danh Mục
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Thêm class spin vào thẻ Spin */}
      {loading && <Spin className="spin" />}
    </>
  );
}

export default CreateCategory;
