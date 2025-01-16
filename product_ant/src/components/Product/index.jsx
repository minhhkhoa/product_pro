import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Tooltip, Modal } from 'antd';
import './style.css';
import ShowProduct from '../ShowProduct';
import FilterProduct from '../Ui/Product/FilterProduct';

const Context = React.createContext({
  name: 'Default',
});

function Product() {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [productToDelete, setProductToDelete] = useState(null); // Sản phẩm cần xóa

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message, description) => {
    api.info({
      message,
      description,
      placement: 'topRight',
    });
  };

  const fetchData = (status = "all", search = "") => {
    let url = `http://localhost:3000/admin/products?status=${status}`;
    if (search) {
      url += `&search=${search}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const dataWithKeys = data.map(item => ({
          ...item,
          key: item._id
        }));
        setData(dataWithKeys);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData(selectedType, searchValue);
  }, [selectedType, searchValue]);

  // Handle change position
  const handleChangePosition = (e, record) => {
    const newPosition = e.target.value; // Lấy giá trị mới từ input
    const productId = record._id; // Lấy ID sản phẩm từ bản ghi

    // Gửi yêu cầu PATCH để thay đổi vị trí
    fetch(`http://localhost:3000/admin/products/change-position/${newPosition}/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        // Hiển thị thông báo thành công
        openNotification("Thành công", "Đã thay đổi vị trí sản phẩm thành công!");
        fetchData(selectedType, searchValue); // Cập nhật lại danh sách
      })
      .catch((error) => {
        // Hiển thị thông báo lỗi
        openNotification("Lỗi", "Không thể thay đổi vị trí sản phẩm!");
        console.error("Error:", error);
      });
  };


  // Hiển thị modal xác nhận xóa
  const showDeleteModal = (id) => {
    //-ghi dua can xoa
    setProductToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Handle delete product
  const handleDelete = () => {
    fetch(`http://localhost:3000/admin/products/delete/${productToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        // Hiển thị thông báo sau khi xóa thành công
        openNotification('Thành công', 'Sản phẩm đã được xóa thành công!');
        fetchData(selectedType, searchValue);
        setIsDeleteModalVisible(false); // Đóng modal sau khi xóa thành công
      })
      .catch((error) => {
        // Hiển thị thông báo lỗi nếu có sự cố
        openNotification('Lỗi', 'Có lỗi xảy ra khi xóa sản phẩm!');
        console.error("Error:", error);
      });
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // Handle status change
  const handleClickStatus = (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";

    fetch(`http://localhost:3000/admin/products/change-status/${newStatus}/${record._id}`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        fetchData(selectedType, searchValue);
      })
      .catch((error) => console.error("Error:", error));
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="product"
          style={{ width: "100px", height: "90px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      render: (_, record) => (
        <input
          type="number"
          min="1"
          defaultValue={record.position} // Hiển thị giá trị vị trí hiện tại
          style={{ width: '50px', height: '30px', textAlign: 'center' }}
          onBlur={(e) => handleChangePosition(e, record)} // Truyền `record` vào hàm
        />
      ),
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
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
      title: 'Hành động',
      dataIndex: '_id',
      render: (_, record) => (
        <div>
          <ShowProduct typeTitle={'Chi tiết'} data={record} />
          <ShowProduct typeTitle={'Sửa'} data={record} />
          <Button
            className='btn danger'
            type='primary'
            danger
            onClick={() => showDeleteModal(record._id)} // Hiển thị modal xác nhận
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1>Danh sách sản phẩm</h1>
      <FilterProduct
        setData={setData}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
        }}
      />
      <Context.Provider value={{ name: 'Ant Design' }}>
        {contextHolder}
      </Context.Provider>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Thông báo"
        open={isDeleteModalVisible}
        onOk={handleDelete} // Xóa sản phẩm khi nhấn ok trong modal
        onCancel={handleCancelDelete} // Đóng modal
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
      </Modal>
    </>
  );
}

export default Product;
