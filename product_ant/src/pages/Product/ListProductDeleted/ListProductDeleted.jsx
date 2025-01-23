import { useEffect, useState } from "react";
import { Button, Table, Modal } from "antd";
import "./style.css";
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons'; // Thêm import icon
import Notification from "../../../utils/Notification";

function ListProductDeleted() {

  const [data, setData] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productID, setProductID] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let url = `http://localhost:3000/admin/products/getProductsDeleted`;

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
    setProductID(id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/admin/products/deleteForever/${productID}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        Notification("success", "Thành công", "Sản phẩm đã được xóa thành công!");
        fetchData();
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Có lỗi xảy ra khi xóa sản phẩm!")

        console.error("Error:", error);
      });
  };

  const handleRollBack = (id) => {
    fetch(`http://localhost:3000/admin/products/rollbackProduct/${id}`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        Notification("success", "Thành công", "Sản phẩm đã được Khôi phục thành công!");
        fetchData();
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Có lỗi xảy ra khi xóa sản phẩm!")

        console.error("Error:", error);
      });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <div className="image" >
          <img
            src={thumbnail}
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
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      render: (_, record) => (
        <input
          type="number"
          min="1"
          defaultValue={record.position}
          style={{ width: "50px", height: "30px", textAlign: "center" }}
        />
      ),
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => (
          <Button
            type="primary"
            className="btn status"
          >
            {record.status}
          </Button>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      render: (_, record) => (
        <div>
          <Button
            className="btn rollback"
            type="primary"
            danger
            onClick={() => handleRollBack(record._id)}
          >
            <UndoOutlined />
            Khôi phục
          </Button>

          <Button
            className="btn danger"
            type="primary"
            danger
            onClick={() => showModalDelete(record._id)}
          >
            <DeleteOutlined />
            Xóa vĩnh viễn
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
      <h1 className='namePage'>Các sản phẩm đã xóa</h1>
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
        <p>Sau lần xóa này sản phẩm sẽ mất vĩnh viễn, bạn có muốn xóa không?</p>
      </Modal>
    </>
  )
}

export default ListProductDeleted;