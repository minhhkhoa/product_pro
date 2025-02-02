import { useState, useEffect } from "react";
import "./style.css";
import { Card, Cascader } from "antd";
import { getDataCategory } from "../../../../../api/admin/index";

// eslint-disable-next-line react/prop-types
function FilterCategory({ selectedType, searchValue, fetchDataProduct, setSelectedCategory }) {
  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const categoryData = await getDataCategory(); // Chờ dữ liệu trả về
        setData(categoryData); // Cập nhật state với dữ liệu
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchDataCategory();
  }, []);


  // Xử lý khi thay đổi hoặc xóa danh mục
  const onChange = (value) => {
    if (value === undefined) {
      // Khi người dùng xóa danh mục
      setSelectedCategory(null); // Xóa danh mục đã chọn
      fetchDataProduct(selectedType, searchValue, null); // Gửi giá trị null lên backend
    } else {
      // Khi người dùng chọn danh mục
      const selectedCategoryId = value[value.length - 1]; // Lấy ID danh mục cuối cùng
      setSelectedCategory(selectedCategoryId); // Lưu danh mục đã chọn
      fetchDataProduct(selectedType, searchValue, selectedCategoryId); // Gọi API với danh mục đã chọn
    }
  };

  return (
    <Card className="cardCategory" title="Lọc theo danh mục" size="small">
      <Cascader
        style={{
          width: "100%",
        }}
        options={data} // Dữ liệu phân cấp
        onChange={onChange}
        maxTagCount="responsive"
        changeOnSelect 
        placeholder="Chọn danh mục"
      />
    </Card>
  );
}

export default FilterCategory;
