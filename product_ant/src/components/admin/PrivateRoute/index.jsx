import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Trạng thái lỗi để lưu thông báo

  // Hàm lấy thông tin người dùng
  const getInfo = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/auth/info", {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      });

      if (res.ok) {
        const data = await res.json();
        setData(data); // Lưu thông tin người dùng
      } else {
        // Nếu API trả về lỗi, lưu thông báo và setError
        const errorData = await res.json();
        setError(errorData.message || "Lỗi xác thực!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // Nếu không thể kết nối server, thông báo lỗi
      setError("Lỗi kết nối đến server");
    } finally {
      // Đảm bảo kết thúc quá trình loading
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfo(); // Gọi hàm lấy thông tin người dùng khi component mount
  }, []);

  if (loading) {
    return (
      <>
        <Spin size="large" />
      </>
    ); // Hiển thị loading khi chưa có dữ liệu
  }

  // Nếu có lỗi (token sai hoặc không hợp lệ), điều hướng về trang đăng nhập
  if (error) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  // Nếu có dữ liệu người dùng hợp lệ, render các children
  return data ? children : <Navigate to="/admin/auth/login" replace />;
};

export default PrivateRoute;
