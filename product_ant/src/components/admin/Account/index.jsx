import { useEffect, useState } from "react";
import { Button, Table, Tooltip, Modal } from "antd";
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Notification from "../../../utils/Notification";
import "./style.css";
import { Link } from "react-router-dom";

function Account() {
  const [data, setData] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let url = `http://localhost:3000/admin/accounts/getAllAccount`;

    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo
      });
      const data = await res.json();
      const dataWithKeys = data.map((item) => ({
        ...item,
        key: item._id,
      }));
      setData(dataWithKeys);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi API với bộ lọc danh mục
  }, []);

  const showDeleteModal = (id) => {
    setAccountToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/admin/accounts/delete/${accountToDelete}`, {
      method: "DELETE",
      credentials: "include", // Đảm bảo gửi cookie kèm theo request
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        Notification(
          "success",
          "Thành công",
          "Tài khoản đã được xóa thành công!"
        );
        fetchData();
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Có lỗi xảy ra khi xóa tài khoản!");

        console.error("Error:", error);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleClickStatus = (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";

    fetch(
      `http://localhost:3000/admin/accounts/change-status/${newStatus}/${record._id}`,
      {
        method: "PATCH",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        Notification(
          "success",
          "Thành công",
          "Thay đổi trạng thái tài khoản thành công!"
        );
        fetchData();
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Đã có lỗi xảy ra!");
        console.error("Error:", error);
      });
  };

  const dataRow = (id) => {
    return data.find((item) => item._id === id); // Trả về sản phẩm có id khớp
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      render: (avatar) => (
        <div className="image">
          <img
            src={avatar}
            alt="product"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ),
    },
    {
      title: () => (
        <Tooltip title="Họ tên">
          <div style={{ textAlign: "center" }}>Họ tên</div>
        </Tooltip>
      ),
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Phân quyền",
      dataIndex: "role",
      render: (role) => (role?.title ? role.title : "Chưa phân quyền"),
      sorter: (a, b) => a.role?.title?.localeCompare(b.role?.title || ""),
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Trạng thái</div>,
      align: "center",
      dataIndex: "status",
      render: (_, record) => (
        <Tooltip
          title={record.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
        >
          <Button
            type="primary"
            className="btn status"
            style={{
              backgroundColor: record.status === "active" ? "#13c2c2" : "black",
              borderColor: record.status === "active" ? "#13c2c2" : "black",
            }}
            onClick={() => handleClickStatus(record)}
          >
            {record.status === "active" ? (
              <CheckCircleOutlined />
            ) : (
              <CloseOutlined />
            )}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      width: 150,
      dataIndex: "_id",
      render: (_, record) => (
        <div className="actionContainer">
          <div className="actionButton">
            <Link
              to={`/admin/account/updateAccount/${record._id}`}
              state={{
                data: dataRow(record._id),
              }}
            >
              <Button className="btn btnEdit" type="primary">
                <EditOutlined />
              </Button>
            </Link>
            <Button
              className="btn btnDelete"
              type="primary"
              danger
              onClick={() => showDeleteModal(record._id)}
              style={{ borderColor: "red" }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="namePage">Danh sách tài khoản</h1>

      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Link to="/admin/account/create">
          <Button type="primary" className="btnCreate">
            <PlusOutlined />
            Thêm mới
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
        }}
        loading={loading}
        showSorterTooltip={false}
        className="tableAccount"
        size="middle"
      />

      <Modal
        title="Thông báo"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa tài khoản này không?</p>
      </Modal>
    </>
  );
}

export default Account;
