import { Button, Input, Card, Select, Table } from 'antd';
import './style.css';

const { Search } = Input;

function Product() {
  const handleSearch = (value) => {
    console.log("Search value:", value);
  };

  const options = [
    {
      value: 'option1',
      label: 'Chọn hành động',
    },
    {
      value: 'option2',
      label: 'Vị trí tăng dần',
    },
    {
      value: 'option3',
      label: 'Vị trí giảm dần',
    },
    {
      value: 'option4',
      label: 'Giá tăng dần',
    },
    {
      value: 'option5',
      label: 'Giá giảm dần',
    },
    {
      value: 'option6',
      label: 'Tiêu đề A - Z',
    },
    {
      value: 'option7',
      label: 'Tiêu đề Z - A',
    },
  ];


  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
    },
    {
      title: 'Tên',
      dataIndex: 'Tên',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Tiêu đề',
    },
    {
      title: 'Giá',
      dataIndex: 'Giá',
    },
    {
      title: 'Vị trí',
      dataIndex: 'Vị trí',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Trạng thái',
    },
    {
      title: 'Người tạo',
      dataIndex: 'Người tạo',
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'Người cập nhật',
    },
    {
      title: 'Hành động',
      dataIndex: 'Hành động',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
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

        <Card className='card' title="Sắp xếp" size="small">
          <div className='card-groupsort'>
            <div >
              <Select
                className='select'
                defaultValue="Chọn hành động"
                options={options}
              />
              <Button className='btnClear' color='danger' variant="solid" type='default'>Clear</Button>
            </div>
          </div>
        </Card>
      </div>


      <Table
        columns={columns}
        dataSource={data}
        showSorterTooltip={{
          target: 'sorter-icon',
        }}
      />
    </>
  );
}

export default Product;
