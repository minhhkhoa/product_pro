import { useEffect, useState, useCallback } from "react";
import { Button, Table, Tooltip, Modal } from "antd";
import "./style.css";
import ShowProduct from "../../Ui/admin/Product/ShowProduct";
import FilterProduct from "../../Ui/admin/Product/Filter/FilterProduct.jsx";
import CreateProduct from "../../Ui/admin/Product/CreateProduct.jsx";
import FilterCategory from "../../Ui/admin/Product/FilterCategory";
import EditProduct from "../../Ui/admin/Product/EditProduct.jsx";
import { DeleteOutlined } from '@ant-design/icons'; // Thêm import icon
import { fetchDataProduct, changePosition, deleteItem, changeStatus } from "../../../api/admin/index.jsx";

// import { useOutletContext } from "react-router-dom"; //- lấy dữ liệu từ context truyền từ Outlet

function Product() {

  // const { dataUser } = useOutletContext(); // Lấy dữ liệu từ Outlet
  // const permissions = dataUser?.user?.permissions || []; // Lấy danh sách quyền của user

  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Thêm state để lưu danh mục được chọn
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => { //-useCallback Giảm số lần render lại không cần thiết
    setLoading(true);
    try {
      const data = await fetchDataProduct(selectedType, searchValue, selectedCategory); // Gọi API với bộ lọc danh mục
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

  const handleRefreshData = () => {
    fetchDataProduct(selectedType, searchValue, selectedCategory);// Gọi lại API với các bộ lọc hiện tại
    loadData();
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

  // if (permissions?.includes("products_view")) {
    return (
      <>
        <h1 className='namePage'>Danh sách sản phẩm</h1>
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
  // }
  // else {
  //   return (
  //     <h1
  //       style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
  //     >
  //       Bạn không có quyền truy cập vào trang này
  //     </h1>
  //   );
  // }
}

export default Product;
