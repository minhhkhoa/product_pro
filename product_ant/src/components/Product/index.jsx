import { Button, Table } from 'antd';
import './style.css';
import { useEffect, useState } from 'react';
import ShowProduct from '../ShowProduct';
import FilterProduct from '../Ui/FilterProduct';


function Product() {

  const [data, setData] = useState([]);


  const fetchData = () => {
    fetch("http://localhost:3000/admin/products")
      .then(res => res.json())
      .then(data => {
        const dataWithKeys = data.map(item => ({
          // Giả định rằng _id là duy nhất cho mỗi phần tử hay mỗi hàng trong table
          ...item, key: item._id
        }));
        setData(dataWithKeys);
      })
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
  }

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
      .then((updatedData) => {
        // Cập nhật state với dữ liệu mới nhất từ server
        const dataWithKeys = updatedData.map(item => ({
          // Giả định rằng _id là duy nhất cho mỗi phần tử hay mỗi hàng trong table
          ...item, key: item._id
        }));
        setData(dataWithKeys);
      })
      .catch((error) => console.error("Error:", error));
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
      render: (position) => {
        return (
          <input
            type="number"
            min='1' value={position}
            name='position'
            style={{ width: '50px', height: '30px', textAlign: 'center' }}
            onChange={handleChange}
          />)
      },
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, record) => {
        //- record: chua du lieu cua dong hien tai
        return (
          <Button type="primary"
            className='btn status'
            onClick={() => handleClickStatus(record)}
          >
            {record.status}
          </Button>
        )
      }
    },
    {
      title: 'Hành động',
      dataIndex: '_id',
      render: (record) => (
        <div>
          <ShowProduct typeTitle={'Chi tiết'} id={record} />
          <ShowProduct typeTitle={'Sửa'} id={record} />
          <ShowProduct typeTitle={'Xóa'} id={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <h1>Danh sách sản phẩm</h1>
      <FilterProduct />

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
