import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./style.css" // Import file CSS
import { login } from '../../../../api/admin';
import Notification from '../../../../utils/Notification';



function Login() {
  const navigate = useNavigate(); // Hook để điều hướng

  const onFinish = async (values) => {
    const res = await login(values.email, values.password);
    const { code, message, } = res;
    switch (code) {
      case 0:
        Notification("warning", message, "Hãy xem lại thông tin");
        break;
      case 1:
        Notification("warning", message, "Hãy xem lại thông tin");
        break;
      case 2:
        Notification("warning", message, "Hãy liên hệ với quản trị viên để được hỗ trợ");
        break;
      case 3:
        Notification("success", message, "Đăng nhập thành công");
        navigate("/admin/dashboard"); // Điều hướng sau khi hiển thị thông báo
        break;
      default:
        Notification('Đăng nhập thất bại');
        break;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="login-container">
      <Form
        className="login-form"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
          ]}
        >
          <Input autoComplete="new-email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập password!',
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
