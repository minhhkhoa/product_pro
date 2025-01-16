import { Button, Table } from 'antd';
import './style.css';
import { useEffect, useState } from 'react';
import ShowProduct from '../ShowProduct';
import FilterProduct from '../Ui/FilterProduct';

function Product() {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchValue, setSearchValue] = useState('');

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

  const handleChange = (e) => {
    console.log(e.target.value);
  };

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
        // Sau khi thay đổi trạng thái, gọi lại fetchData với điều kiện lọc hiện tại
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
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      render: (position) => (
        <input
          type="number"
          min="1"
          value={position}
          name="position"
          style={{ width: '50px', height: '30px', textAlign: 'center' }}
          onChange={handleChange}
        />
      ),
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, record) => (
        <Button
          type="primary"
          className="btn status"
          onClick={() => handleClickStatus(record)}
        >
          {record.status}
        </Button>
      ),
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
      <FilterProduct setData={setData} selectedType={selectedType}
        setSelectedType={setSelectedType} searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 6,
        }}
      />
    </>
  );
}

export default Product;
