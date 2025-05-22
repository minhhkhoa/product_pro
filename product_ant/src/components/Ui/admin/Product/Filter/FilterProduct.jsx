import { Button, Input, Card } from 'antd';
import "./style.css";
const { Search } = Input;

// eslint-disable-next-line react/prop-types
const FilterProduct = ({ selectedType, setSelectedType, searchValue, setSearchValue, fetchDataProduct, selectedCategory }) => {
  
  const handleSearch = (value) => {
    setSearchValue(value);
    fetchDataProduct(selectedType, value, selectedCategory);
  };

  const handleClick = (type) => {
    setSelectedType(type);
    fetchDataProduct(type, searchValue, selectedCategory);
  };

  return (
    <div className="group-utils">
      <Card className="card" title="Bộ lọc và tìm kiếm" size="small">
        <div className="card-groupsearch">
          <div className="frm-search_left">
            <Button
              type={selectedType === "all" ? "primary" : "default"}
              onClick={() => handleClick("all")}
              style={{ color: "volcano" }}
            >
              Tất cả
            </Button>
            <Button
              type={selectedType === "active" ? "primary" : "default"}
              onClick={() => handleClick("active")}
            >
              Hoạt động
            </Button>
            <Button
              type={selectedType === "inactive" ? "primary" : "default"}
              onClick={() => handleClick("inactive")}
            >
              Dừng hoạt động
            </Button>
          </div>
          <div className="frm-search_right">
            <Search
              placeholder="Nhập tên sản phẩm"
              allowClear
              // enterButton="Tìm kiếm"
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
