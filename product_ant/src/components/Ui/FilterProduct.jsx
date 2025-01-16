const { Search } = Input;
import { Button, Input, Card } from 'antd';


const FilterProduct = () => {
  const handleSearch = (value) => {
    console.log("Search value:", value);
  };

  return (
    <> 
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
    </>
  );
}

export default FilterProduct;