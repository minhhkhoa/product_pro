import React, { useEffect, useState } from "react";
import { Button, Table, notification, Tooltip, Modal } from "antd";
import "./style.css";
import ShowProduct from "../Ui/Product/ShowProduct/index";
import FilterProduct from "../Ui/Product/Filter/FilterProduct";
import CreateProduct from "../Ui/Product/CreateProduct.jsx";
import FilterCategory from "../Ui/Product/FilterCategory/index.jsx";
import EditProduct from "../Ui/Product/EditProduct.jsx";

const Context = React.createContext({
  name: "Default",
});

function Product() {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Thêm state để lưu danh mục được chọn
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message, description) => {
    api.info({
      message,
      description,
      placement: "topRight",
    });
  };

  const fetchData = async (status = "all", search = "", categoryId = null) => {
    setLoading(true);
    let url = `http://localhost:3000/admin/products?status=${status}`;
    if (search) {
      url += `&search=${search}`;
    }
    if (categoryId) {
      url += `&category=${categoryId}`;
    }

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
    fetchData(selectedType, searchValue, selectedCategory); // Gọi API với bộ lọc danh mục
  }, [selectedType, searchValue, selectedCategory]);

  // Handle change position
  const handleChangePosition = (e, record) => {
    const newPosition = e.target.value;
    const productId = record._id;

    fetch(
      `http://localhost:3000/admin/products/change-position/${newPosition}/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(() => {
        openNotification(
          "Thành công",
          "Đã thay đổi vị trí sản phẩm thành công!"
        );
        fetchData(selectedType, searchValue, selectedCategory);
      })
      .catch((error) => {
        openNotification("Lỗi", "Không thể thay đổi vị trí sản phẩm!");
        console.error("Error:", error);
      });
  };

  const showDeleteModal = (id) => {
    setProductToDelete(id);
    setIsDeleteModalVisible(true);
  };

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
        openNotification("Thành công", "Sản phẩm đã được xóa thành công!");
        fetchData(selectedType, searchValue, selectedCategory);
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        openNotification("Lỗi", "Có lỗi xảy ra khi xóa sản phẩm!");
        console.error("Error:", error);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleClickStatus = (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";

    fetch(
      `http://localhost:3000/admin/products/change-status/${newStatus}/${record._id}`,
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
        fetchData(selectedType, searchValue, selectedCategory);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleRefreshData = () => {
    fetchData(selectedType, searchValue, selectedCategory);// Gọi lại API với các bộ lọc hiện tại
  };

  const dataRow = (id) => {
    return data.find((item) => item._id === id); // Trả về sản phẩm có id khớp
  };


  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="product"
          style={{ width: "100px", height: "90px", objectFit: "cover" }}
        />
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
          onBlur={(e) => handleChangePosition(e, record)}
        />
      ),
      sorter: (a, b) => a.position - b.position,
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
          <ShowProduct typeTitle={"Chi tiết"} data={dataRow(record._id)} />
          <EditProduct
            typeTitle={"Sửa"}
            data={dataRow(record._id)}
            handleRefreshData={handleRefreshData} />
          <Button
            className="btn danger"
            type="primary"
            danger
            onClick={() => showDeleteModal(record._id)}
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FilterProduct
          setData={setData}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <FilterCategory setSelectedCategory={setSelectedCategory} />

        <CreateProduct onProductCreated={handleRefreshData} />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
        }}
        loading={loading}
      />
      <Context.Provider value={{ name: "Ant Design" }}>
        {contextHolder}
      </Context.Provider>

      <Modal
        title="Thông báo"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
      </Modal>
    </>
  );
}

export default Product;
