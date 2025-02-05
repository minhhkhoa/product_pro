import { useEffect, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Cascader } from 'antd';
import "./style.css";
import { getDataCategory } from '../../../api/admin';
import { useNavigate } from "react-router";

const SelectCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

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
  const onChange = (value) => {
    if (value === undefined) {
      navigate("/");
    } else {
      const selectedCategoryId = value[value.length - 1];
      navigate(`/products-category/${selectedCategoryId}`);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <FilterOutlined
        style={{ margin: "0 10px", fontSize: "23px" }}
      />
      <Cascader
        style={{
          width: "100%",
        }}
        options={category} // Dữ liệu phân cấp
        onChange={onChange}
        maxTagCount="responsive"
        expandTrigger="hover"
        placeholder="Chọn danh mục"
      />
    </div>
  );
};

export default SelectCategory;
