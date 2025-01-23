import { useEffect, useState } from "react";
import { Button, Table, Modal } from "antd";
import "./style.css";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'; // Thêm import icon
import Notification from "../../utils/Notification";
import CreateRole from "../Ui/Role/CreateRole";

function Role() {

  const [data, setData] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let url = `http://localhost:3000/admin/roles/getAllRole`;

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
    fetchData();
  }, []);

  const showModalDelete = (id) => {
    setRoleId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/admin/roles/delete/${roleId}`, {
      method: "DELETE",
    })
      .then((res) => res.json()) // Chuyển response sang JSON
      .then((data) => {
        if (data.message === "Role deleted successfully") {
          Notification("success", "Thành công", "Nhóm quyền đã được xóa thành công!");
          fetchData(); // Load lại dữ liệu sau khi xóa
          setIsDeleteModalVisible(false);
        } else {
          throw new Error(data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        Notification("error", "Lỗi", error.message || "Có lỗi xảy ra khi xóa nhóm quyền!");
        console.error("Error:", error);
      });
  };


  const columns = [
    
    {
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (description) => (
        <div
          dangerouslySetInnerHTML={{ __html: description }} // Render nội dung HTML
        ></div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      render: (_, record) => (
        <div>
          <Button
            className="btn"
            type="primary"
          >
            <EditOutlined />
            Sửa
          </Button>

          <Button
            className="btn danger"
            type="primary"
            danger
            onClick={() => showModalDelete(record._id)}
          >
            <DeleteOutlined />
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };


  return (
    <>
      <h1 className='namePage'>Các nhóm quyền</h1>
      <CreateRole resetData={fetchData}/>

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
        <p>Bạn có muốn xóa nhóm quyền này không?</p>
      </Modal>
    </>
  )
}

export default Role;