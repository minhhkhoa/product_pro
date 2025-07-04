import { useState, useEffect, useCallback } from 'react';
// React,
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
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import './style.css'; // Import file CSS tùy chỉnh
import { Link, useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { getDataCategory, dataCategoryById, editItem } from '../../../../api/admin/index';

const { Option } = Select;

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);


function UpdateCategory() {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const [form] = Form.useForm();
  // const [api, contextHolder] = notification.useNotification();

  const [dataCategory, setDataCategory] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchData = async () => {
    try {
      const categoryData = await getDataCategory("flat");
      setDataCategory(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  //-mục đích của hàm này là dán dữ liệu của danh mục được chọn
  //-vào các trường của form
  const fetchDataById = useCallback(
    async (id) => {
      try {
        const result = await dataCategoryById(id)

        // Cập nhật các trường của form bằng dữ liệu nhận được
        form.setFieldsValue({
          title: result.title,
          parent_id: result.parent_id, // Đảm bảo rằng `parent_id` là một ID hợp lệ
          description: result.description,
          position: result.position,
          status: result.status,
        });

        // Cập nhật fileList cho ảnh thumbnail nếu có
        if (result.thumbnail) {
          setFileList([
            {
              uid: '-1', // uid phải là duy nhất
              name: 'thumbnail',
              status: 'done',
              url: result.thumbnail,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    [form, setFileList] // Các dependencies cần thiết
  );

  useEffect(() => {
    fetchData();
    fetchDataById(id);
  }, [id, fetchDataById]);


  const onFinish = async (values) => {
    values.description = editorContent;

    // Tạo formData và thêm dữ liệu
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('parent_id', values.parent_id);
    formData.append('description', editorContent);
    formData.append('position', values.position || '');
    formData.append('status', values.status);

    // Chỉ gửi ảnh nếu có ảnh mới
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('thumbnail', fileList[0].originFileObj);
    }

    try {
      await editItem(formData, id, "products-category");

      form.resetFields(); // Reset form
      setFileList([]); // Reset fileList
      setEditorContent(''); // Reset nội dung Editor
      navigate('/admin/products-category', { //- gửi thông báo tới trang navigate tới
        state: {
          title: "Thành công",
          description: "Danh mục đã được cập nhật thành công!"
        }
      }); // Truyền trạng thái

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
      <h1 className="namePage">Sửa Danh Mục Sản Phẩm</h1>

      <Card bordered={false} className="form-container">
        <Form
          form={form}
          layout="vertical"
          name="create-category"
          onFinish={onFinish}
          initialValues={{ status: "active" }}
        >
          <Divider orientation="left">Thông tin cơ bản</Divider>

          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục sản phẩm" />
          </Form.Item>

          <Form.Item name="parent_id" label="Danh mục cha">
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
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
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
                <img
                  alt="preview"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            )}
          </Form.Item>

          <Divider orientation="left">Cài đặt nâng cao</Divider>

          <Form.Item label="Vị trí" name="position">
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Tự động tăng nếu để trống"
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Radio.Group>
              <Radio value="active">Hoạt động</Radio>
              <Radio value="inactive">Dừng hoạt động</Radio>
            </Radio.Group>
          </Form.Item>

          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              style={{ color: "white", backgroundColor: "blue", padding: "8px" }}
              htmlType="submit"
            >
              Sửa Danh Mục
            </Button>
            <Link
              to={"/admin/products-category"}
              style={{ marginLeft: "10px" }}
            >
              <Button>Trở về</Button>
            </Link>
          </div>
        </Form>
      </Card>
    </>
  );
}

export default UpdateCategory;
