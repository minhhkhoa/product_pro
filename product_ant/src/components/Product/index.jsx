import { Button, Input, Card, Table } from 'antd';
import './style.css';
import { useEffect, useState } from 'react';

const { Search } = Input;

function Product() {

  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:3000/admin/products")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setData(data);
      })
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (value) => {
    console.log("Search value:", value);
  };

  const columns = [
    //-data tra ra theo dung theo cac cot nay
    //-dataIndex: se lay key ma fetch về vd là: price hay status...
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      render: (thumbnail) =>
        <img src={thumbnail}
          alt="product"
          style={{ width: "100px", height: "90px", objectFit: "cover" }}
        />,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Hành động',
      dataIndex: 'Hành động',
      render: (record) => (
        <div>
          <Button type="link" onClick={() => console.log("Edit", record.key)}>
            Chi tiết
          </Button>
          <Button type="link" onClick={() => console.log("Edit", record.key)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => console.log("Delete", record.key)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1>Danh sách sản phẩm</h1>
      <div className='group-utils'>
        <Card className='card' title="Bộ lọc và tìm kiếm" size="small">
          <div className='card-groupsearch'>
            <div className="frm-search_left">
              <Button type="primary">Tất cả</Button>
              <Button type="default">Hoạt động</Button>
              <Button type="default">Dừng hoạt động</Button>
            </div>
            <div className="frm-search_right">
              <Search
                placeholder="Nhập tên sản phẩm"
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                onSearch={handleSearch}
                style={{
                  width: 300,
                }}
              />
            </div>
          </div>
        </Card>
      </div>


      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 6, // Số bản ghi trên mỗi trang
          // showSizeChanger: true, // Cho phép người dùng thay đổi số bản ghi trên mỗi trang
          // pageSizeOptions: ['2', '3', '4', '10'], // Các lựa chọn số bản ghi
        }}
        showSorterTooltip={{
          target: 'sorter-icon',
        }}
      />
    </>
  );
}

export default Product;
