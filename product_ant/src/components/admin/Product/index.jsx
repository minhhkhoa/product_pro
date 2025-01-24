import { useEffect, useState } from "react";
import { Button, Table, Tooltip, Modal } from "antd";
import "./style.css";
import ShowProduct from "../../Ui/admin/Product/ShowProduct";
import FilterProduct from "../../Ui/admin/Product/Filter/FilterProduct.jsx";
import CreateProduct from "../../Ui/admin/Product/CreateProduct.jsx";
import FilterCategory from "../../Ui/admin/Product/FilterCategory";
import EditProduct from "../../Ui/admin/Product/EditProduct.jsx";
import { DeleteOutlined } from '@ant-design/icons'; // Thêm import icon
import Notification from "../../../utils/Notification";
import { fetchData } from "../../../api/admin/index.jsx";


function Product() {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Thêm state để lưu danh mục được chọn
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchData(selectedType, searchValue, selectedCategory); // Gọi API với bộ lọc danh mục
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
        Notification('success', 'Thành công', 'Đã thay đổi vị trí sản phẩm thành công!');

        fetchData(selectedType, searchValue, selectedCategory);
      })
      .catch((error) => {
        Notification('error', 'Lỗi', 'Không thể thay đổi vị trí sản phẩm!');
        console.log(error);

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
        Notification("success", "Thành công", "Sản phẩm đã được xóa thành công!");
        fetchData(selectedType, searchValue, selectedCategory);
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Có lỗi xảy ra khi xóa sản phẩm!")

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
        Notification("success", "Thành công", "Thay đổi trạng thái sản phẩm thành công!");
        fetchData(selectedType, searchValue, selectedCategory);
      })
      .catch((error) => {
        Notification("error", "Lỗi", "Đã có lỗi xảy ra!");
        console.error("Error:", error);
      });
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
            <DeleteOutlined />
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className='namePage'>Danh sách sản phẩm</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FilterProduct
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          fetchData={fetchData}
          selectedCategory={selectedCategory}
        />
        <FilterCategory
          selectedType={selectedType}
          searchValue={searchValue}
          fetchData={fetchData}
          setSelectedCategory={setSelectedCategory}
        />

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
