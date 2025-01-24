import { Layout } from 'antd';
const { Sider, Content } = Layout;
import './style.css';
import { Outlet } from "react-router-dom";
import MenuSider from '../../components/admin/MenuSider';


function LayoutDefault() {
  return (
    <>
      <Layout className="layout-default">
        <header className='header'>
          <h1>Admin</h1>
          <div className="header-right">
            <a href="#" className='header-right__user'>User</a>
            <a href="#" className='header-right__logout'>Đăng xuất</a>
          </div>
        </header>
        <Layout>
          <Sider className='sider'>
            <MenuSider/>
          </Sider>
          <Content>
            {/* hien thi cac con cua LayoutDefault o day bang Outlet */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutDefault;