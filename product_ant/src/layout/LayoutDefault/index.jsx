import { Layout } from "antd";
const { Sider, Content } = Layout;
import "./style.css";
import { Outlet } from "react-router-dom";
import MenuSider from "../../components/admin/MenuSider";
import { useEffect, useState } from "react";
import { getInfoCurrentUser } from "../../api/admin";
import InforUser from "../../components/Common/InforUser";

function LayoutDefault() {
  const [data, setData] = useState(null);

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

  return (
    <Layout className="layout-default">
      <header className="header">
        <h1>Admin</h1>
        {/* <div className="header-right">
          <a href="#" className="header-right__user">{data?.user?.fullName}</a>
          <button className="header-right__logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div> */}
        <InforUser/>
      </header>
      <Layout>
        <Sider className="sider">
          <MenuSider dataUser={data} />
        </Sider>
        <Content>
          {/* Truyền `dataUser` xuống thông qua context */}
          <Outlet context={{ dataUser: data }} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutDefault;
