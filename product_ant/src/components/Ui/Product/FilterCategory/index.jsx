import { useState, useEffect } from "react";
import "./style.css";
import { Card, Cascader } from "antd";

// eslint-disable-next-line react/prop-types
function FilterCategory({ setSelectedCategory }) {
  const [data, setData] = useState([]);

  // Chuyển đổi danh sách danh mục thành dạng cây
  const convertToTree = (categories) => {
    const map = {};
    const tree = [];

    categories.forEach((item) => {
      map[item._id] = {
        value: item._id,
        label: item.title,
        children: [],
      };
    });

    categories.forEach((item) => {
      if (item.parent_id) {
        map[item.parent_id]?.children.push(map[item._id]);
      } else {
        tree.push(map[item._id]);
      }
    });

    return tree;
  };

  // Lấy dữ liệu danh mục từ API
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

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý khi thay đổi danh mục
  const onChange = (value) => {
    const selectedCategoryId = value[value.length - 1]; // Lấy ID cuối cùng (danh mục con hoặc cha)
    setSelectedCategory(selectedCategoryId); // Gửi ID lên component cha
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
        placeholder="Chọn danh mục"
      />
    </Card>
  );
}

export default FilterCategory;
