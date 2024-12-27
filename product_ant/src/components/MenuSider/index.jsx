import { Menu } from "antd";
import {
  PieChartOutlined,
  HddOutlined,
  HomeOutlined,
  FormOutlined,
  MergeOutlined,
  AuditOutlined,
  SettingOutlined
}
  from '@ant-design/icons';

function MenuSider() {
  const items = [
    {
      key: 'sub1',
      label: 'Tổng quan',
      icon: <HomeOutlined />,
    },
    {
      key: 'sub2',
      label: 'Danh mục sản phẩm',
      icon: <PieChartOutlined />,
    },
    {
      key: 'sub3',
      label: 'Danh sách sản phẩm',
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
        defaultSelectedKeys={['sub3']}
        mode="inline"
        items={items}
        style={{ height: "100%" }}
      />
    </>
  )
}

export default MenuSider;