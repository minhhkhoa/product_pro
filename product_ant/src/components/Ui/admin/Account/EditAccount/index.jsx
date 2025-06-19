import { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  Card,
  Divider,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
import PropTypes from "prop-types";
import Notification from "../../../../../utils/Notification";
import { getAllRoles, editItem } from "../../../../../api/admin/index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  </div>
);

function EditAccount() {
  const location = useLocation();
  const data = useMemo(() => location.state?.data || {}, [location.state]);
  const [dataRole, setDataRole] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

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
          uid: "-1",
          name: "avatar.png",
          status: "done",
          url: data.avatar,
        },
      ]);
    }

    // Cập nhật giá trị form khi data thay đổi
    if (data) {
      form.setFieldsValue({
        fullName: data?.fullName || "",
        email: data?.email || "",
        password: data?.password || "***********",
        phone: data?.phone || "",
        role_id: data?.role_id || "",
        status: data?.status || "",
      });
    }
  }, [data, form]);

  // Xử lý form submit
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("role_id", values.role_id);
    formData.append("status", values.status);

    if (fileList.length > 0 && fileList[0]?.originFileObj) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    try {
      console.log("formData", formData);
      await editItem(formData, data._id, "accounts");
      form.resetFields();
      setFileList([]);
      navigate("/admin/accounts");
    } catch (error) {
      console.log("Đã có lỗi xảy ra khi cập nhật tài khoản!", error);
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
    <div>
      <h1 className="namePage">Sửa tài khoản</h1>
      <Card bordered={false} className="form-container">
        <Form
          name="editAccount"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{}} //-để rỗng và sẽ cập nhật trên useEffect
        >
          <Divider orientation="left">Thông tin cơ bản</Divider>
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

          <div
            className="btn-submit"
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Button
              style={{ color: "white", backgroundColor: "blue" }}
              htmlType="submit"
              form="editAccount"
            >
              Sửa tài khoản
            </Button>

            <Link to="/admin/accounts">
              <Button>Trở về</Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default EditAccount;

EditAccount.propTypes = {
  typeTitle: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired, // Dữ liệu tài khoản
};
