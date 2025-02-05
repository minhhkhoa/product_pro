import { useEffect, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Cascader } from 'antd';
import "./style.css";
import { getDataCategory } from '../../../api/admin';
import { useNavigate, useLocation } from "react-router";

const SelectCategory = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const [category, setCategory] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]); // State lưu giá trị đã chọn

  useEffect(() => {
    const fetchCategory = async () => {
      const data = await getDataCategory();
      if (data) {
        setCategory(data);
      } else {
        console.log("error");
      }
    };
    fetchCategory();
  }, []);


  useEffect(() => {
    if (!location.pathname.startsWith("/products-category/")) {
      setSelectedValue([]); // Xóa lựa chọn nếu KHÔNG ở trang "/products-category/:id"
    }
  }, [location.pathname]);

  const onChange = (value) => {
    if (!value || value.length === 0) {
      navigate("/");
    } else {
      const selectedCategoryId = value[value.length - 1];
      navigate(`/products-category/${selectedCategoryId}`);
      setSelectedValue(value); // Lưu giá trị đã chọn
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <FilterOutlined style={{ margin: "0 10px", fontSize: "23px" }} />
      <Cascader
        style={{ width: "100%" }}
        options={category} // Dữ liệu phân cấp
        onChange={onChange}
        maxTagCount="responsive"
        expandTrigger="hover"
        placeholder="Chọn danh mục"
        value={selectedValue} // Gán giá trị để có thể reset
      />
    </div>
  );
};

export default SelectCategory;
