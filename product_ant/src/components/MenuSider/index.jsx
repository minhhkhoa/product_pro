import { Menu, Tooltip } from "antd";
import {
  PieChartOutlined,
  HddOutlined,
  HomeOutlined,
  FormOutlined,
  MergeOutlined,
  AuditOutlined,
  SettingOutlined,
  StrikethroughOutlined,
  CoffeeOutlined,
}
  from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";

function MenuSider() {

  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const items = [
    {
      key: 'dashBoard',
      label: 'Tổng quan',
      icon: <HomeOutlined />,
    },
    {
      key: 'category',
      label: (
        <Tooltip title="Danh mục sản phẩm">
          <span>Danh mục sản phẩm</span>
        </Tooltip>
      ),
      icon: <PieChartOutlined />,
      children: [
        {
          label: <Link to="/products-category">Danh mục</Link>,
          key: "/products-category",
          icon: <StrikethroughOutlined />,
        },
        {
          label: <Link to="/products-category/createCategory">Thêm danh mục</Link>,
          key: "/products-category/createCategory",
          icon: <CoffeeOutlined />,

        }
      ]
    },
    {
      key: '/products',
      label: (
        <Tooltip title="">
          <Link to="/products">Danh sách sản phẩm</Link>
        </Tooltip>
      ),
      icon: <HddOutlined />,
    },
    {
      key: 'sub4',
      label: 'Nhóm quyền',
      icon: <FormOutlined />,
    },
    {
      key: 'sub5',
      label: 'Phân quyền',
      icon: <MergeOutlined />,
    },
    {
      key: 'sub6',
      label: 'Danh sách tài khoản',
      icon: <AuditOutlined />,
    },
    {
      key: 'sub7',
      label: 'Cài đặt chung',
      icon: <SettingOutlined />,
    },
  ];
  return (
    <>
      <Menu
        theme={'dark'}
        selectedKeys={[location.pathname]} // Thay đổi giá trị selectedKeys dựa trên đường dẫn hiện tại
        mode="inline"
        items={items}
        style={{ height: "100%" }}
      />
    </>
  )
}

export default MenuSider;