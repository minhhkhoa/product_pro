import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Upload,
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
const { Option } = Select;
import "./style.css";
import PropTypes from 'prop-types';
import Notification from '../../../../../utils/Notification';
import { getAllRoles, editItem } from '../../../../../api/admin/index';


const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);

// eslint-disable-next-line react/prop-types
function EditAccount({ typeTitle, data, handleRefreshData }) {

  const [dataRole, setDataRole] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDataRoles = async () => {
    try {
      const resultData = await getAllRoles();
      const dataWithKeys = resultData.map((item) => ({
        ...item,
        key: item._id,
      }));
      setDataRole(dataWithKeys);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Gọi API để lấy danh mục sản phẩm
    fetchDataRoles();

    // Cập nhật fileList nếu có ảnh avatar
    if (data?.avatar) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: data.avatar,
        },
      ]);
    }

    // Cập nhật giá trị form khi data thay đổi
    if (data && form) { //-nếu data thay đổi
      if (isModalOpen) { //-nếu model đã được mở
        form.setFieldsValue({ //- mới bắt đầu gán dữ liệu vào form
          fullName: data?.fullName || '',
          email: data?.email || '',
          password: data?.password || '***********',
          phone: data?.phone || '',
          role_id: data?.role_id || '',
          status: data?.status || '',
        });
      }
    }
  }, [data, form, isModalOpen]);


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
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('role_id', values.role_id);
    formData.append('status', values.status);

    if (fileList.length > 0 && fileList[0]?.originFileObj) {
      formData.append('avatar', fileList[0].originFileObj);
    }
    // Duyệt qua FormData và in ra dữ liệu
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    try {
      console.log("formData", formData);
      await editItem(formData, data._id, "accounts");
      form.resetFields(); // Reset form
      setFileList([]); // Reset fileList
      handleRefreshData();
    } catch (error) {
      console.log('Đã có lỗi xảy ra khi cập nhật tài khoản!', error);
      Notification("error", "Lỗi", "Đã có lỗi xảy ra khi cập nhật tài khoản!");
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
      <Button className="btn btnEdit" type="primary" onClick={showModal}>
        <EditOutlined />
        {typeTitle}
      </Button>
      <Modal
        title={typeTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name={data._id} //-vì có rất nhiều modal chứa form nên phải có tên riêng
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{}} //-để rỗng và sẽ cập nhật trên useEffect
        >
          <Form.Item
            label="Họ tên:"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email:"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu:"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]} // Sửa lại message cho đúng
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Phân quyền:"
            name="role_id"
            rules={[{ required: true, message: "Vui lòng chọn quyền hạn!" }]}
          >
            <Select allowClear>
              {dataRole.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Avatar:" name="avatar">
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
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            )}
          </Form.Item>

          <Form.Item label="Trạng thái:" name="status">
            <Radio.Group>
              <Radio value="active"> Hoạt động </Radio>
              <Radio value="inactive"> Dừng hoạt động </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditAccount;

EditAccount.propTypes = {
  typeTitle: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,  // Dữ liệu tài khoản
};
