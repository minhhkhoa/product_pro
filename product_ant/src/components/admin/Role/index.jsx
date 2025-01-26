import { useEffect, useState } from "react";
import { Button, Table, Modal } from "antd";
import "./style.css";
import { DeleteOutlined } from '@ant-design/icons'; // Thêm import icon
import Notification from "../../../utils/Notification";
import CreateRole from "../../Ui/admin/Role/CreateRole";
import EditRole from "../../Ui/admin/Role/EditRole";
import { deleteItem, getAllRoles } from "../../../api/admin/index";

function Role() {

  const [data, setData] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDataRoles = async () => {
    setLoading(true);
    try {
      const resultData = await getAllRoles();
      const dataWithKeys = resultData.map((item) => ({
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
    fetchDataRoles();
  }, []);

  const showModalDelete = (id) => {
    setRoleId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    deleteItem(roleId, "roles")
      .then(() => {
        fetchDataRoles(); // Load lại dữ liệu sau khi xóa
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        Notification("error", "Lỗi", error.message || "Có lỗi xảy ra khi xóa nhóm quyền!");
        console.error("Error:", error);
      });
  };

  const dataRow = (id) => {
    return data.find((item) => item._id === id); // Trả về sản phẩm có id khớp
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
          <EditRole
            data={dataRow(record._id)}
            fetchDataRoles={fetchDataRoles}
          />
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
      <CreateRole fetchDataRoles={fetchDataRoles} />

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