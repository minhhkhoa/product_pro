import { Button, Input, Card } from 'antd';

const { Search } = Input;

// eslint-disable-next-line react/prop-types
const FilterProduct = ({ setData, selectedType, setSelectedType, searchValue, setSearchValue }) => {
  
  const handleSearch = (value) => {
    setSearchValue(value);
    fetchData(value, selectedType);
  };

  const fetchData = (search = '', status = 'all') => {
    let url = `http://localhost:3000/admin/products?status=${status}`;
    if (search) {
      url += `&search=${search}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const dataWithKeys = data.map((item) => ({
          ...item,
          key: item._id,
        }));
        setData(dataWithKeys);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleClick = (type) => {
    setSelectedType(type);
    fetchData(searchValue, type);
  };

  return (
    <div className="group-utils">
      <Card className="card" title="Bộ lọc và tìm kiếm" size="small">
        <div className="card-groupsearch">
          <div className="frm-search_left">
            <Button
              type={selectedType === 'all' ? 'primary' : 'default'}
              onClick={() => handleClick('all')}
            >
              Tất cả
            </Button>
            <Button
              type={selectedType === 'active' ? 'primary' : 'default'}
              onClick={() => handleClick('active')}
            >
              Hoạt động
            </Button>
            <Button
              type={selectedType === 'inactive' ? 'primary' : 'default'}
              onClick={() => handleClick('inactive')}
            >
              Dừng hoạt động
            </Button>
          </div>
          <div className="frm-search_right">
            <Search
              placeholder="Nhập tên sản phẩm"
              allowClear
              enterButton="Tìm kiếm"
              size="large"
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FilterProduct;
