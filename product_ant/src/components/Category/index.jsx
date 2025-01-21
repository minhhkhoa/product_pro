import { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import "./style.css";
import Highlighter from 'react-highlight-words';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'; // Thêm import icon
import { Link } from 'react-router-dom';



function Category() {

  const [data, setData] = useState([]);

  // Lấy dữ liệu danh mục từ API
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/products/getCategory");
      const result = await res.json();

      // Gắn key cho từng phần tử trong mảng dữ liệu
      const dataWithKeys = result.map((item, index) => ({
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

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
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
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  //-start column
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
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
      width: '30%',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        return (
          <div>
            <Link to={`/products-category/updateCategory/${record._id}`}>
              <Button className="btn" type="primary">
                <EditOutlined />
                Sửa
              </Button>
            </Link>

            <Button className="btn btnDelete" type="primary" danger>
              <DeleteOutlined />
              Xóa
            </Button>
          </div>
        )
      }
    },
  ];
  //-end column



  return (
    <>
      <h1 className='namePage'>Danh mục sản phẩm</h1>
      <Link to="/products-category/createCategory">
        <Button className="btnCreateCategory" type="primary">
          <PlusOutlined />
          Thêm mới
        </Button>
      </Link>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 4,
        }}
      />
    </>
  )
}

export default Category;