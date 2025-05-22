import { useEffect, useState, useCallback } from "react";
import { Button, Table, Tooltip, Modal, Drawer } from "antd";
import "./style.css";
import ShowProduct from "../../Ui/admin/Product/ShowProduct";
import FilterProduct from "../../Ui/admin/Product/Filter/FilterProduct.jsx";
import FilterCategory from "../../Ui/admin/Product/FilterCategory";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, StopOutlined } from "@ant-design/icons";
import {
  fetchDataProduct,
  changePosition,
  deleteItem,
  changeStatus,
} from "../../../api/admin/index.jsx";
import { Link } from "react-router-dom";

function Product() {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Thêm state để lưu danh mục được chọn
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    //-useCallback Giảm số lần render lại không cần thiết
    setLoading(true);
    try {
      const data = await fetchDataProduct(
        selectedType,
        searchValue,
        selectedCategory
      ); // Gọi API với bộ lọc danh mục
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, searchValue, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [selectedType, searchValue, selectedCategory, loadData]);

  // Handle change position
  const handleChangePosition = (e, record) => {
    const newPosition = e.target.value;
    const productId = record._id;
    changePosition(newPosition, productId);
    fetchDataProduct(selectedType, searchValue, selectedCategory);
  };

  const showDeleteModal = (id) => {
    setProductToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    deleteItem(productToDelete, "products")
      .then(() => {
        // Sau khi xóa thành công, gọi lại API để tải dữ liệu mới
        loadData();
        setIsDeleteModalVisible(false); // Đóng modal
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        setIsDeleteModalVisible(false);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleClickStatus = (record) => {
    const id = record._id;
    const newStatus = record.status === "active" ? "inactive" : "active";

    changeStatus(newStatus, id)
      .then(() => {
        // Sau khi xóa thành công, gọi lại API để tải dữ liệu mới
        loadData();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const dataRow = (id) => {
    return data.find((item) => item._id === id); // Trả về sản phẩm có id khớp
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <div className="image">
          <img
            src={thumbnail}
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
        <Button
          type="primary"
          className="btn status"
          style={{
            backgroundColor: record.status === "active" ? "#13c2c2" : "#722ed1",
            borderColor: record.status === "active" ? "#13c2c2" : "#722ed1",
          }}
          onClick={() => handleClickStatus(record)}
        >
          <Tooltip
            title={record.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
          >
            {record.status === "active" ? (
              <CheckCircleOutlined />
            ) : (
              <StopOutlined />
            )}
          </Tooltip>
        </Button>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      render: (_, record) => (
        <div>
          <Button onClick={() => setDrawerOpen(record._id)}>
            Xem chi tiết
          </Button>

          <Link
            to={`/admin/products/updateProduct/${record._id}`}
            state={{
              data: dataRow(record._id),
            }}
          >
            <Button className="btn editProduct" type="primary">
              <EditOutlined />
              Sửa
            </Button>
          </Link>

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

  // if (permissions?.includes("products_view")) {
  return (
    <>
      <h1 className="namePage">Danh sách sản phẩm</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FilterProduct
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          fetchDataProduct={fetchDataProduct}
          selectedCategory={selectedCategory}
        />
        <FilterCategory
          selectedType={selectedType}
          searchValue={searchValue}
          fetchDataProduct={fetchDataProduct}
          setSelectedCategory={setSelectedCategory}
        />

        <Link to="/admin/products/createProduct">
          <Button type="primary" className="btnCreate">
            <PlusOutlined />
            Thêm sản phẩm
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

      <Drawer
        title="Chi tiết sản phẩm"
        width={720}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {drawerOpen && <ShowProduct data={dataRow(drawerOpen)} />}
      </Drawer>
    </>
  );
}

export default Product;
