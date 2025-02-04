import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderClient from "../HeaderClient/index";
import FooterClient from "../FooterClient/index";
import FlashSale from "../FlashSale/index";
import "./style.css";

import { useParams } from "react-router-dom";

const { Content } = Layout;

const ClientLayout = () => {

  const { slugProduct } = useParams();

  return (
    <Layout className="layout-client">
      {/* Header */}
      <HeaderClient />

      {/* Nội dung trang chính */}
      <Content style={{ padding: "0 50px" }}>
        {/* Flash Sale */}
        {
          slugProduct ?
            <div>
            </div> :
            <div className="flash-sale-container">
              <FlashSale />
            </div>
        }


        {/* Nội dung trang con */}
        <div className="content-outlet">
          <Outlet />
        </div>
      </Content>

      {/* Footer */}
      <FooterClient />
    </Layout>
  );
};

export default ClientLayout;
