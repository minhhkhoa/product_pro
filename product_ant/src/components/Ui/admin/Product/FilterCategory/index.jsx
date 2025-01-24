import { useState, useEffect } from "react";
import "./style.css";
import { Card, Cascader } from "antd";

// eslint-disable-next-line react/prop-types
function FilterCategory({ selectedType, searchValue, fetchData, setSelectedCategory }) {
  const [data, setData] = useState([]);

  // Chuyển đổi danh sách danh mục thành dạng cây
  const convertToTree = (categories) => {
    const map = {};
    const tree = [];

    categories.forEach((item) => {
      //-xếp theo id
      map[item._id] = {
        value: item._id,
        label: item.title,
        children: [],
      };
    });

    categories.forEach((item) => {
      //-thêm vào cây
      if (item.parent_id) {
        map[item.parent_id]?.children.push(map[item._id]);
      } else {
        tree.push(map[item._id]);
      }
    });

    return tree;
  };

  // Lấy dữ liệu danh mục từ API


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/products/getCategory");
        const result = await res.json();
        const treeData = convertToTree(result);
        setData(treeData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  // Xử lý khi thay đổi hoặc xóa danh mục
  const onChange = (value) => {
    if (value === undefined) {
      console.log("first")
      // Khi người dùng xóa danh mục
      setSelectedCategory(null); // Xóa danh mục đã chọn
      fetchData(selectedType, searchValue, null); // Gửi giá trị null lên backend
    } else {
      // Khi người dùng chọn danh mục
      const selectedCategoryId = value[value.length - 1]; // Lấy ID danh mục cuối cùng
      setSelectedCategory(selectedCategoryId); // Lưu danh mục đã chọn
      fetchData(selectedType, searchValue, selectedCategoryId); // Gọi API với danh mục đã chọn
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
