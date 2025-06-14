import {
  BellFilled,
  DownOutlined,
  KeyOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getInfoCurrentUser } from "../../api/admin";
import { useNavigate } from "react-router-dom";
import "./style.css";


export default function InforUser() {
  const [data, setData] = useState(null);

  const navigate = useNavigate();
  const getInfo = async () => {
    try {
      const data = await getInfoCurrentUser();
      if (data.ok) {
        setData(data);
      } else {
        console.error("Lỗi: Dữ liệu phản hồi không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        Cookies.remove("token");
        navigate("/admin/auth/login");
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const items = [
    {
      key: "1",
      label: "Thông tin tài khoản",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Hồ sơ cá nhân",
      icon: <UserAddOutlined />,
      extra: "⌘P",
    },
    {
      key: "3",
      label: "Đổi mật khẩu",
      icon: <KeyOutlined />,
      extra: "⌘B",
    },
    {
      key: "4",
      label: (
        <span style={{ color: "red" }} onClick={handleLogout}>
          Đăng xuất
        </span>
      ),
      icon: <LoginOutlined />,
      extra: "⌘S",
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <BellFilled style={{ color: "#fff", fontSize: "26px" }} />
      <Dropdown menu={{ items }}>
        <div className="user">
          <div
            className="user-info"
            style={{ display: "flex", alignItems: "center", color: "#fff" }}
          >
            <span className="user-info__name">{data?.user?.fullName}</span>
            <span className="user-info__role">{data?.user?.role}</span>
          </div>
          <div>
            <Space>
              <img
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                src={data?.user?.avatar}
                alt="avatar"
              />
              <DownOutlined />
            </Space>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
