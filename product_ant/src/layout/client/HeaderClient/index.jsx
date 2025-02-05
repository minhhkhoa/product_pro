import { Link } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import "./style.css";
import logo from './logo.webp';
import Filter from "../Filter";


const HeaderClient = () => {
  return (
    <header className="header-client">
      <div className="logo">
        <Link to="/">
          <img className="image" src={logo} alt="Logo" />
        </Link>
        <h1 className="pageHome">Products</h1>
      </div>

      <div className="header-util">
        <Filter/>
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
