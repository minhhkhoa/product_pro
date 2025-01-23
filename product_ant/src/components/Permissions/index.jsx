import  { useState, useEffect } from "react";
import { Table, Checkbox, Button, message } from "antd";
import "./style.css"; // Import file CSS tùy chỉnh

const permissionsData = [
  {
    group: "Danh mục sản phẩm",
    permissions: [
      { key: "products-category_create", label: "Thêm mới" },
      { key: "products-category_edit", label: "Chỉnh sửa" },
      { key: "products-category_delete", label: "Xóa" },
    ],
  },
  {
    group: "Sản phẩm",
    permissions: [
      { key: "products_view", label: "Xem" },
      { key: "products_create", label: "Thêm mới" },
      { key: "products_edit", label: "Chỉnh sửa" },
      { key: "products_delete", label: "Xóa" },
    ],
  },
  {
    group: "Nhóm quyền",
    permissions: [
      { key: "roles_create", label: "Thêm mới" },
      { key: "roles_edit", label: "Chỉnh sửa" },
      { key: "roles_delete", label: "Xóa" },
      { key: "roles_permissions", label: "Phân quyền" },
    ],
  },
  {
    group: "Tài khoản",
    permissions: [
      { key: "account_view", label: "Xem" },
      { key: "account_create", label: "Thêm mới" },
      { key: "account_edit", label: "Chỉnh sửa" },
      { key: "account_delete", label: "Xóa" },
    ],
  },
];

const PermissionsTable = () => {
  const [roles, setRoles] = useState([]);

  // Fetch dữ liệu từ API
  const fetchData = async () => {
    const url = `http://localhost:3000/admin/roles/getAllRole`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const dataWithKeys = data.map((item) => ({
        ...item,
        key: item._id, // Gắn key duy nhất
        permissions: item.permissions || {}, // Gắn giá trị mặc định
      }));
      setRoles(dataWithKeys);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thay đổi quyền
  const handlePermissionChange = (roleId, permissionKey, isChecked) => {
    const updatedRoles = roles.map((role) => {
      if (role.key === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [permissionKey]: isChecked,
          },
        };
      }
      return role;
    });
    setRoles(updatedRoles);
  };

  // Xử lý khi submit
  const handleSubmit = () => {
    console.log("Dữ liệu phân quyền gửi lên:", roles);
    message.success("Cập nhật quyền thành công!");
  };

  // Tạo cột cho bảng
  const columns = [
    {
      title: "Nhóm quyền",
      dataIndex: "group",
      key: "group",
      // eslint-disable-next-line no-unused-vars
      onCell: (record, rowIndex) => ({
        rowSpan: record.rowSpan, // Merge cells bằng cách đặt rowSpan ở đây
      }),
    },
    {
      title: "Quyền",
      dataIndex: "permissionLabel",
      key: "permissionLabel",
    },
    ...roles.map((role) => ({
      title: role.title,
      key: `role-${role.key}`,
      render: (_, record) => {
        const permissionKey = record.permissionKey;
        const isChecked = role.permissions?.[permissionKey] || false;

        return (
          <Checkbox
            checked={isChecked}
            onChange={(e) =>
              handlePermissionChange(role.key, permissionKey, e.target.checked)
            }
          />
        );
      },
    })),
  ];


  // Chuẩn bị dữ liệu cho bảng
  const dataSource = [];
  permissionsData.forEach((group, groupIndex) => {
    group.permissions.forEach((permission, permissionIndex) => {
      dataSource.push({
        key: `${groupIndex}-${permissionIndex}`,
        group: permissionIndex === 0 ? group.group : null, // Chỉ hiển thị tên nhóm ở dòng đầu tiên
        permissionLabel: permission.label,
        permissionKey: permission.key,
        rowSpan: permissionIndex === 0 ? group.permissions.length : 0, // Merge cells cho nhóm quyền
      });
    });
  });


  return (
    <div className="permissions-container">
      <h1 className="namePage">Phân quyền</h1>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        className="permissions-table"
      />
      <div className="actions-container">
        <Button type="primary" onClick={handleSubmit} className="submit-button">
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default PermissionsTable;
