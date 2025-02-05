import { useEffect, useState } from "react";
import { Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import SelectCategory from "../../../components/client/SelectCategory";
import "./style.css";

const { Search } = Input;

function Filter() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const [searchValue, setSearchValue] = useState(""); // Lưu giá trị input

  const onSearch = (value) => {
    if (value) {
      navigate(`/search?search=${value}`);
    }
  };

  // Khi đường dẫn thay đổi, kiểm tra nếu không phải trang `/search`, thì xóa input
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has("search")) {
      setSearchValue("");
    }
  }, [location.pathname, location.search]); // Lắng nghe thay đổi của URL

  return (
    <div className="container-filter">
      <div>
        <Search
          className="search"
          placeholder="Nhập từ khóa tìm kiếm"
          onSearch={onSearch}
          value={searchValue} // Gán giá trị cho input
          onChange={(e) => setSearchValue(e.target.value)} // Cập nhật khi nhập
          style={{ width: 200 }}
        />
      </div>
      
      <div className="select-category">
        <SelectCategory />
      </div>
    </div>
  );
}

export default Filter;
