import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Spin,
  Upload
} from "antd";
import md5 from "md5";
import { PlusOutlined } from "@ant-design/icons";
import Notification from "../../../../../utils/Notification";
import { createItem, checkEmailExists, getAllRoles } from "../../../../../api/admin/index";
import "./style.css";

const { Option } = Select;

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);

// eslint-disable-next-line react/prop-types
function CreateAccount({ handleRefreshData }) {
  const [form] = Form.useForm();
  const [dataRole, setDataRole] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

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
    fetchDataRoles();
  }, []);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("role_id", values.role_id);
    formData.append("status", values.status);
    if (fileList.length > 0) {
      formData.append('avatar', fileList[0].originFileObj); // Chỉ gửi ảnh đầu tiên
    } // Đảm bảo avatar là file

    try {
      // Kiểm tra email đã tồn tại chưa
      const emailExists = await checkEmailExists(values.email);
      if (emailExists) {
        Notification("error", "Lỗi", "Email đã tồn tại!");
        setLoading(false);
        return;
      }

      // Nếu có mật khẩu thì hash, không thì bỏ đi
      if (values.password) {
        values.password = md5(values.password);
      } else {
        delete values.password;
      }

      //-gửi password đã mã hóa lên server
      formData.append("password", values.password);

      // Gửi data lên server
      await createItem(formData, setLoading, "accounts");
      form.resetFields();
      setIsModalOpen(false);
      handleRefreshData(); // Gọi callback để reload danh sách
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      Notification("error", "Lỗi", "Có lỗi xảy ra khi tạo tài khoản!");
    }
  };

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
        <PlusOutlined /> Thêm mới
      </Button>

      <Modal
        title="Thêm tài khoản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="create-account"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: "user", status: "active" }}
        >
          <Form.Item
            label="Họ và tên:"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email:"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input autoComplete="new-email" />
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
            ]}
            label="Mật khẩu:"
            name="password">
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Vai trò:"
            name="role_id"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select allowClear>
              {dataRole.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Phần chọn ảnh và hiển thị preview */}
          <Form.Item label="Ảnh sản phẩm:" name="avatar">
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

          <Form.Item label="Trạng thái:" name="status">
            <Radio.Group>
              <Radio value="active"> Hoạt động </Radio>
              <Radio value="inactive"> Dừng hoạt động </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {loading && <Spin className="spin" />}
    </>
  );
}

export default CreateAccount;
