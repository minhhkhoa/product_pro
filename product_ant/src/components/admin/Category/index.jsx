import { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal } from "antd";
import "./style.css";
import Highlighter from "react-highlight-words";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"; // Thêm import icon
import { Link } from "react-router-dom";
import { getDataCategory, deleteItem } from "../../../api/admin/index";

// import { useOutletContext } from "react-router-dom"; //- lấy dữ liệu từ context truyền từ Outlet

function Category() {
  // const { dataUser } = useOutletContext(); // Lấy dữ liệu từ Outlet
  // const permissions = dataUser?.user?.permissions || []; // Lấy danh sách quyền của user

  const [data, setData] = useState([]);
  const [idDelete, setIdDelete] = useState(null);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  // Lấy dữ liệu danh mục từ API
  const fetchData = async () => {
    try {
      const categoryData = await getDataCategory("flat"); // Chờ dữ liệu trả về

      // Gắn key cho từng phần tử trong mảng dữ liệu
      const dataWithKeys = categoryData.map((item, index) => ({
        ...item,
        key: item._id || index, // Sử dụng _id làm key, nếu không có thì dùng index
      }));

      setData(dataWithKeys);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => (
      <SearchOutlined
        style={{
          color: "white",
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const showModal = (id) => {
    setIdDelete(id);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      await handleDelete(idDelete); // Đợi hàm xóa chạy xong
    } catch (error) {
      console.error("Error during delete:", error);
    }

    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      deleteItem(id, "products-category").then(() => {
        // Sau khi xóa thành công, gọi lại API để tải dữ liệu mới
        fetchData();
        setOpen(false);
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
    }
  };

  //-start column
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 230,
      render: (thumbnail) => (
        <div className="image" style={{ transform: "TranslateX(40%)" }}>
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
      key: "title",
      width: "40%",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <div className="actionContainer">
            <div className="actionButton">
              <Link
                to={`/admin/products-category/updateCategory/${record._id}`}
              >
                <Button
                  className="btn btnEdit"
                  type="primary"
                  // style={{ background: "#EBFCE4 !important" }}
                >
                  <EditOutlined style={{ color: "green" }} />
                </Button>
              </Link>

              <Button
                className="btn btnDelete"
                type="primary"
                danger
                onClick={() => showModal(record._id)}
                style={{ borderColor: "red" }}
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
                Hoạt động
              </span>
            </p>
          </div>
        );
      },
    },
  ];
  //-end column

  // if (permissions.includes("products_category_view")) {
  return (
    <>
      <h1 className="namePage">Danh mục sản phẩm</h1>
      <Link to="/admin/products-category/createCategory">
        <Button className="btnCreateCategory" type="primary">
          <PlusOutlined />
          Thêm mới
        </Button>
      </Link>

      <Table
        className="tableCate"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 4,
        }}
        size="small"
      />

      <Modal
        title="Thông báo"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Bạn có muốn xóa danh mục này không?</p>
      </Modal>
    </>
  );
  // }else{
  //   return (
  //     <h1
  //       style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
  //     >
  //       Bạn không có quyền truy cập vào trang này
  //     </h1>
  //   );
  // }
}

export default Category;
