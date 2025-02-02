import { useState, useEffect } from "react";
import { Table, Checkbox, Button } from "antd";
import "./style.css"; // Import file CSS tùy chỉnh
import Notification from "../../../utils/Notification";

const permissionsData = [
  {
    group: "Danh mục sản phẩm",
    permissions: [
      { key: "products_category_create", label: "Thêm mới" },
      { key: "products_category_edit", label: "Chỉnh sửa" },
      { key: "products_category_delete", label: "Xóa" },
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

  // Lấy dữ liệu roles từ API
  const fetchData = async () => {
    const url = `http://localhost:3000/admin/roles/getAllRole`;

    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      });
      const data = await res.json();
      const dataWithKeys = data.map((item) => ({
        ...item,
        key: item._id,
        permissions: item.permissions.reduce((acc, curr) => {
          acc[curr] = true; // Gán true cho các quyền đã được cấp
          return acc;
        }, {}),
      }));
      setRoles(dataWithKeys);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm thay đổi trạng thái quyền khi checkbox thay đổi
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

  // Hàm gửi dữ liệu phân quyền cập nhật
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/roles/permissions", {
        method: "PATCH",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roles),
      });

      if (res.ok) {
        Notification("success", "Thành công", "Phân quyền đã được sửa thành công!");
        fetchData();
      } else {
        Notification("error", "Lỗi", "Đã có lỗi xảy ra khi sửa phân quyền!");
      }
    } catch (error) {
      Notification("error", "Lỗi", "Đã xảy ra lỗi không mong muốn!");
      console.error("Error submitting permissions:", error);
    }
  };

  const columns = [
    {
      title: "Nhóm quyền",
      dataIndex: "group",
      key: "group",
      onCell: (record) => ({
        rowSpan: record.rowSpan,
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

  const dataSource = [];
  permissionsData.forEach((group, groupIndex) => {
    group.permissions.forEach((permission, permissionIndex) => {
      dataSource.push({
        key: `${groupIndex}-${permissionIndex}`,
        group: permissionIndex === 0 ? group.group : null,
        permissionLabel: permission.label,
        permissionKey: permission.key,
        rowSpan: permissionIndex === 0 ? group.permissions.length : 0,
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
