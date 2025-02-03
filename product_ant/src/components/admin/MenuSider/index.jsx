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
  DeploymentUnitOutlined,
  ProductOutlined
} from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

function MenuSider({ dataUser }) {
  const permissions = dataUser?.user?.permissions || []; // Lấy danh sách quyền của user
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Xây dựng các item menu
  const items = [
    {
      key: '/admin/dashboard',
      label: <Link to="/admin/dashboard">Tổng quan</Link>,
      icon: <HomeOutlined />,
      permission: "dashboard_view",
      alwaysShow: true, // Đảm bảo luôn hiển thị
    },
    {
      key: 'category',
      label: (
        <Tooltip title="Danh mục sản phẩm">
          <span>Danh mục sản phẩm</span>
        </Tooltip>
      ),
      icon: <PieChartOutlined />,
      permission: "products_category_view",
      children: [
        {
          label: <Link to="/admin/products-category">Danh mục</Link>,
          key: "/admin/products-category",
          icon: <StrikethroughOutlined />,
        },
        {
          label: <Link to="/admin/products-category/createCategory">Thêm danh mục</Link>,
          key: "/admin/products-category/createCategory",
          icon: <CoffeeOutlined />,
        }
      ]
    },
    {
      key: 'rootProduct',
      label: (
        <Tooltip title="Danh sách sản phẩm">
          <span>Danh sách sản phẩm</span>
        </Tooltip>
      ),
      icon: <HddOutlined />,
      permission: "products_view",
      children: [
        {
          label: <Link to="/admin/products">Sản phẩm</Link>,
          key: "/admin/products",
          icon: <ProductOutlined />,
        },
        {
          label: <Link to="/admin/products-deleted">Sản phẩm đã xóa</Link>,
          key: "/admin/products-deleted",
          icon: <DeploymentUnitOutlined />,
        }
      ]
    },
    {
      key: '/admin/roles',
      label: <Link to="/admin/roles">Nhóm quyền</Link>,
      icon: <FormOutlined />,
      permission: "roles_permissions",
    },
    {
      key: '/admin/permissions',
      label: <Link to="/admin/permissions">Phân quyền</Link>,
      icon: <MergeOutlined />,
      permission: "roles_permissions",
    },
    {
      key: '/admin/accounts',
      label: <Link to="/admin/accounts">Danh sách tài khoản</Link>,
      icon: <AuditOutlined />,
      permission: "account_view",
    },
    {
      key: 'sub7',
      label: 'Cài đặt chung',
      icon: <SettingOutlined />,
      permission: "settings_view",
      alwaysShow: true,
    },
  ];

  // Lọc các item chỉ hiển thị nếu người dùng có quyền tương ứng
  const filteredItems = items
    .filter(item => item.alwaysShow || permissions.includes(item.permission)) // Đảm bảo mục có `alwaysShow` hoặc có quyền
    .map(item => {
      // Loại bỏ thuộc tính `alwaysShow` khỏi các item
      // eslint-disable-next-line no-unused-vars
      const { alwaysShow, ...restItem } = item;

      if (restItem.children) {
        // Kiểm tra quyền cho mục cha và các mục con
        // Nếu mục cha có quyền thì mục con sẽ luôn được hiển thị
        restItem.children = restItem.children.filter(child => permissions.includes(child.permission) || restItem.permission && permissions.includes(restItem.permission));
      }

      return restItem;
    });

  return (
    <Menu
      theme="dark"
      selectedKeys={[location.pathname]}
      mode="inline"
      items={filteredItems}
      style={{ height: "100%" }}
    />
  );
}

export default MenuSider;

MenuSider.propTypes = {
  dataUser: PropTypes.shape({
    user: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};
