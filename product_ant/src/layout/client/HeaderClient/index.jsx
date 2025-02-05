import { Link } from "react-router-dom";
import { Input } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import "./style.css";
import logo from './logo.webp';
import SelectCategory from "../../../components/client/SelectCategory";


const HeaderClient = () => {
  return (
    <header className="header-client">
      <div className="logo">
        <Link to="/">
          <img className="image" src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="search-bar">
        <Input.Search className="gido" placeholder="Tìm kiếm sản phẩm..." enterButton />
      </div>
      <div className="select-category">
        <SelectCategory/>
      </div>
      <div className="header-icons">
        <Link to="/cart">
          <ShoppingCartOutlined className="icon" />
        </Link>
        <Link to="/login">
          <UserOutlined className="icon" />
        </Link>
      </div>
    </header>
  );
};

export default HeaderClient;
