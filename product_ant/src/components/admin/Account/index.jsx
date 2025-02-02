import { useEffect, useState } from "react";
import { Button, Table, Tooltip, Modal } from "antd";
import "./style.css";
// import ShowProduct from "../../Ui/admin/Product/ShowProduct";
import EditAccount from "../../Ui/admin/Account/EditAccount/index.jsx";
import { DeleteOutlined } from '@ant-design/icons'; // Thêm import icon
import Notification from "../../../utils/Notification";
import CreateAccount from "../../Ui/admin/Account/CreateAccount/CreateAccount.jsx";


function Account() {
  const [data, setData] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let url = `http://localhost:3000/admin/accounts/getAllAccount`;


    try {
      const res = await fetch(url);
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
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        Notification("success", "Thành công", "Tài khoản đã được xóa thành công!");
        fetchData();
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Có lỗi xảy ra khi xóa tài khoản!")

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
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        Notification("success", "Thành công", "Thay đổi trạng thái tài khoản thành công!");
        fetchData();
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Đã có lỗi xảy ra!");
        console.error("Error:", error);
      });
  };

  const handleRefreshData = () => {
    fetchData();// Gọi lại API với các bộ lọc hiện tại
  };

  const dataRow = (id) => {
    return data.find((item) => item._id === id); // Trả về sản phẩm có id khớp
  };


  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      render: (avatar) => (
        <div className="image" >
          <img
            src={avatar}
            alt="product"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain"
            }}
          />
        </div>
      ),
    },
    {
      title: "Họ tên",
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
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => (
        <Tooltip title="Click to change status">
          <Button
            type="primary"
            className="btn status"
            onClick={() => handleClickStatus(record)}
          >
            {record.status}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      render: (_, record) => (
        <div>
          <EditAccount
            typeTitle={"Sửa tài khoản"}
            data={dataRow(record._id)}
            handleRefreshData={handleRefreshData} />
          <Button
            className="btn danger"
            type="primary"
            danger
            onClick={() => showDeleteModal(record._id)}
          >
            <DeleteOutlined />
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className='namePage'>Danh sách tài khoản</h1>

      <CreateAccount
        handleRefreshData={handleRefreshData}
      />

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
        }}
        loading={loading}
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
