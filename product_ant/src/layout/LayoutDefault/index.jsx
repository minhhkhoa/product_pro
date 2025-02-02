import { Layout } from "antd";
import Cookies from "js-cookie"; // import thư viện js-cookie
const { Sider, Content } = Layout;
import "./style.css";
import { Outlet, useNavigate } from "react-router-dom";
import MenuSider from "../../components/admin/MenuSider";
import { useEffect } from "react";
import { useState } from "react";

function LayoutDefault() {
  
  const [data, setData] = useState(null);
  const navigate = useNavigate(); // Sử dụng navigate để điều hướng

  const getInfo = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/auth/info", {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      });

      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    }
  }

  useEffect(() => {
    // Kiểm tra cookie token khi render
    getInfo();
  }, []); // Sử dụng useEffect để thực hiện side effect
  

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/auth/logout", {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      });

      if (res.ok) {
        // Xóa cookie (nếu muốn) trước khi điều hướng
        Cookies.remove("token");
        navigate("/admin/auth/login"); // Chuyển hướng về trang đăng nhập
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <Layout className="layout-default">
      <header className="header">
        <h1>Admin</h1>
        <div className="header-right">
          <a href="#" className="header-right__user">{data?.user?.fullName}</a>
          <button className="header-right__logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>
      <Layout>
        <Sider className="sider">
          <MenuSider />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutDefault;
