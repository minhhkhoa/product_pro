import { useState } from "react";
import {
  Layout,
  Card,
  Switch,
  Button,
  Select,
  message,
  Divider,
  List,
  Typography,
  Upload,
  Row,
  Col
} from "antd";
import {
  UserOutlined,
  NotificationOutlined,
  AppstoreAddOutlined,
  CloudUploadOutlined,
  DisconnectOutlined
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

function Setting() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [customization, setCustomization] = useState({
    theme: "Light",
    fontSize: "Medium",
  });
  const [avatar, setAvatar] = useState(null);

  // Fake data for notifications and settings
  const notificationData = [
    { id: 1, message: language === "en" ? "You have a new order!" : "Bạn có một đơn hàng mới!", type: "info" },
    { id: 2, message: language === "en" ? "50% off on a product!" : "Có một sản phẩm giảm giá 50%!", type: "warning" },
    { id: 3, message: language === "en" ? "New app version update" : "Cập nhật ứng dụng phiên bản mới", type: "success" },
  ];

  // Fake data for activity log
  const activityData = [
    { id: 1, activity: language === "en" ? "Logged into the system" : "Đăng nhập vào hệ thống", date: "10/02/2025" },
    { id: 2, activity: language === "en" ? "Updated personal profile" : "Cập nhật hồ sơ cá nhân", date: "09/02/2025" },
    { id: 3, activity: language === "en" ? "Changed password" : "Đổi mật khẩu", date: "08/02/2025" },
  ];

  const handleThemeChange = (value) => {
    setCustomization((prevState) => ({
      ...prevState,
      theme: value,
    }));
    message.success(`${language === "en" ? "Theme changed to" : "Chế độ giao diện được đổi thành"} ${value}`);
  };

  const handleFontSizeChange = (value) => {
    setCustomization((prevState) => ({
      ...prevState,
      fontSize: value,
    }));
    message.success(`${language === "en" ? "Font size changed to" : "Cỡ chữ đã được thay đổi thành"} ${value}`);
  };

  const handleUpload = (file) => {
    setAvatar(URL.createObjectURL(file));
    message.success(language === "en" ? 'Avatar updated' : 'Ảnh đại diện đã được cập nhật');
    return false;
  };

  return (
    <Layout className={darkMode ? "dark-mode" : "light-mode"}>
      <Content style={{ padding: "20px" }}>
        <Title level={2}>{language === "en" ? "Settings" : "Cài Đặt"}</Title>

        {/* Dark Mode */}
        <Card title={language === "en" ? "Theme Mode" : "Chế độ Giao Diện"} style={{ marginBottom: "20px" }}>
          <p>{language === "en" ? "Choose your theme mode:" : "Chọn chế độ giao diện của bạn:"}</p>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Card>

        {/* Change Language */}
        <Card title={language === "en" ? "Language" : "Ngôn Ngữ"} style={{ marginBottom: "20px" }}>
          <Select value={language} onChange={(value) => setLanguage(value)} style={{ width: "100%" }}>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="vi">Tiếng Việt</Select.Option>
            <Select.Option value="fr">Français</Select.Option>
          </Select>
        </Card>

        {/* Notification Settings */}
        <Card title={language === "en" ? "Notifications" : "Thông Báo"} style={{ marginBottom: "20px" }}>
          <p>{language === "en" ? "Manage notifications:" : "Quản lý thông báo:"}</p>
          <Switch checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
        </Card>

        {/* Customize Theme Settings */}
        <Card title={language === "en" ? "Customization" : "Tùy Chỉnh Giao Diện"} style={{ marginBottom: "20px" }}>
          <p>{language === "en" ? "Choose theme:" : "Chọn chủ đề giao diện:"}</p>
          <Select value={customization.theme} onChange={handleThemeChange} style={{ width: "100%" }}>
            <Select.Option value="Light">{language === "en" ? "Light" : "Sáng"}</Select.Option>
            <Select.Option value="Dark">{language === "en" ? "Dark" : "Tối"}</Select.Option>
          </Select>

          <Divider />

          <p>{language === "en" ? "Choose font size:" : "Chọn cỡ chữ:"}</p>
          <Select value={customization.fontSize} onChange={handleFontSizeChange} style={{ width: "100%" }}>
            <Select.Option value="Small">{language === "en" ? "Small" : "Nhỏ"}</Select.Option>
            <Select.Option value="Medium">{language === "en" ? "Medium" : "Vừa"}</Select.Option>
            <Select.Option value="Large">{language === "en" ? "Large" : "Lớn"}</Select.Option>
          </Select>
        </Card>

        {/* Notifications List */}
        <Card title={language === "en" ? "Notification Updates" : "Thông Báo Cập Nhật"} style={{ marginBottom: "20px" }}>
          <List
            dataSource={notificationData}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.message}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>

        {/* App Management */}
        <Card title={language === "en" ? "App Management" : "Quản lý Ứng Dụng"} style={{ marginBottom: "20px" }}>
          <Button type="primary" icon={<AppstoreAddOutlined />} style={{ width: "100%" }}>
            {language === "en" ? "Update App" : "Cập nhật ứng dụng"}
          </Button>
        </Card>

        {/* Avatar Management */}
        <Card title={language === "en" ? "Avatar" : "Ảnh Đại Diện"} style={{ marginBottom: "20px" }}>
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
            accept="image/*"
          >
            <Button icon={<CloudUploadOutlined />}>
              {language === "en" ? "Upload Image" : "Tải ảnh lên"}
            </Button>
          </Upload>
          {avatar && <img src={avatar} alt="Avatar" style={{ width: "100px", marginTop: "10px" }} />}
        </Card>

        {/* Security Settings */}
        <Card title={language === "en" ? "Security Settings" : "Cài Đặt Bảo Mật"} style={{ marginBottom: "20px" }}>
          <p>{language === "en" ? "Manage your access permissions:" : "Quản lý quyền truy cập của bạn:"}</p>
          <Button icon={<DisconnectOutlined />} type="danger" style={{ width: "100%" }}>
            {language === "en" ? "Log out from all devices" : "Đăng xuất tất cả thiết bị"}
          </Button>
        </Card>

        {/* Social Media Connection */}
        <Card title={language === "en" ? "Social Media Connections" : "Kết Nối Mạng Xã Hội"} style={{ marginBottom: "20px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Button type="primary" style={{ width: "100%" }}>
                {language === "en" ? "Connect Facebook" : "Kết nối Facebook"}
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" style={{ width: "100%" }}>
                {language === "en" ? "Connect Google" : "Kết nối Google"}
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Connected Devices */}
        <Card title={language === "en" ? "Connected Devices" : "Thiết Bị Đã Kết Nối"} style={{ marginBottom: "20px" }}>
          <p>{language === "en" ? "Your connected devices list:" : "Danh sách thiết bị đã kết nối của bạn:"}</p>
          <List
            dataSource={["Device 1", "Device 2", "Device 3"]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Card>

        {/* Activity Log */}
        <Card title={language === "en" ? "Activity Log" : "Nhật Ký Hoạt Động"} style={{ marginBottom: "20px" }}>
          <List
            dataSource={activityData}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.activity}</Typography.Text> - <Typography.Text type="secondary">{item.date}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>

        {/* Other Settings */}
        <Card title={language === "en" ? "Other Settings" : "Cài Đặt Khác"}>
          <Button type="default" icon={<UserOutlined />} style={{ width: "100%" }}>
            {language === "en" ? "Manage Account" : "Quản lý tài khoản"}
          </Button>
          <Button type="default" icon={<NotificationOutlined />} style={{ width: "100%", marginTop: "10px" }}>
            {language === "en" ? "Manage Notifications" : "Quản lý thông báo"}
          </Button>
        </Card>
      </Content>
    </Layout>
  );
}

export default Setting;
