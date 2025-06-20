import { useEffect, useState, useCallback } from "react";
import { Button, Table, Tooltip, Modal, Drawer } from "antd";
import "./style.css";
import ShowProduct from "../../Ui/admin/Product/ShowProduct";
import FilterProduct from "../../Ui/admin/Product/Filter/FilterProduct.jsx";
import FilterCategory from "../../Ui/admin/Product/FilterCategory";
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
      title: () => <div style={{ textAlign: "center" }}>Hình ảnh</div>,
      width: 230,
      dataIndex: "thumbnail",
      align: "center",
      render: (thumbnail) => (
        <div className="imageProduct">
          <img
            src={thumbnail}
            alt="product"
            style={{
              height: "80px",
              width: "80px",
              objectFit: "contain",
            }}
          />
        </div>
      ),
    },
    {
      title: () => (
        <Tooltip title="Ấn để sắp xếp">
          <div style={{ textAlign: "center" }}>Tiêu đề</div>
        </Tooltip>
      ),
      // align: "center",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 300,
    },
    {
      title: () => (
        <Tooltip title="Ấn để sắp xếp">
          <div style={{ textAlign: "center" }}>Giá</div>
        </Tooltip>
      ),
      align: "center",
      dataIndex: "price",
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
      width: 170,
    },
    {
      title: () => (
        <Tooltip title="Ấn để sắp xếp">
          <div style={{ textAlign: "center" }}>Vị trí</div>
        </Tooltip>
      ),
      align: "center",
      dataIndex: "position",
      width: 170,
      render: (_, record) => (
        <input
          type="number"
          min="1"
          defaultValue={record.position}
          style={{ width: "50px", height: "30px", textAlign: "center" }}
          onClick={(e) => {
            e.stopPropagation();
            setTimeout(() => handleChangePosition(e, record), 100);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ),
      sorter: (a, b) => a.position - b.position,
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
            onClick={(e) => {
              e.stopPropagation();
              handleClickStatus(record);
            }}
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
      title: () => <div style={{ textAlign: "center" }}>Hành động</div>,
      width: 220,
      dataIndex: "_id",
      render: (_, record) => (
        <>
          <div className="actionContainer">
            <div className="actionButton">
              <Link
                to={`/admin/products/updateProduct/${record._id}`}
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
                onClick={(e) => {
                  e.stopPropagation();
                  showDeleteModal(record._id);
                }}
              >
                <DeleteOutlined />
              </Button>
            </div>
            <p>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#98593B",
                }}
              >
                {record.featured === "1" ? "Nổi bật" : "Ưu đãi lớn"}
              </span>
            </p>
          </div>
        </>
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

        <Link to="/admin/products/createProduct" style={{ paddingTop: 80 }}>
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
        size="small"
        className="tableProduct"
        showSorterTooltip={false}
        onRow={(record) => ({
          onClick: () => setDrawerOpen(record._id),
        })}
      />

      <Modal
        title="Thông báo"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, ghost: true }}
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
