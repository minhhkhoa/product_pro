import { Layout, Card, Row, Col, Table, List, Alert } from "antd";
import { Line } from "@ant-design/charts";
import { Pie } from "@ant-design/plots";
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, GiftOutlined } from "@ant-design/icons";
import fakeData from "./datafake";
import "./style.css";

const { Content } = Layout;

function DashBoard() {
  // Cấu hình biểu đồ doanh thu theo tháng
  const revenueConfig = {
    data: fakeData.monthlyRevenue.map((value, index) => ({ month: `Tháng ${index + 1}`, value })),
    xField: "month",
    yField: "value",
    smooth: true,
  };

  // Cấu hình biểu đồ đơn hàng theo trạng thái
  const orderStatusConfig = {
    data: fakeData.orderStatus,
    angleField: "value",
    colorField: "type",
    label: { type: "spider", content: "{name}: {value}" },
  };

  // Cột cho bảng đơn hàng gần đây
  const orderColumns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Tổng tiền", dataIndex: "total", key: "total", render: (text) => `${text.toLocaleString()}đ` },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Ngày đặt hàng", dataIndex: "date", key: "date" },
  ];

  return (
    <Layout className="dashboard">
      <Content>
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Tổng quan cửa hàng */}
        <Row gutter={16}>
          <Col span={6}>
            <Card className="stat-card" title="Tổng đơn hàng" extra={<ShoppingCartOutlined />} bordered={false}>
              <p>{fakeData.overview.orders} đơn</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card" title="Doanh thu hôm nay" extra={<DollarOutlined />} bordered={false}>
              <p>{fakeData.overview.revenue.toLocaleString()}đ</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card" title="Khách hàng" extra={<UserOutlined />} bordered={false}>
              <p>{fakeData.overview.customers}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card" title="Sản phẩm" extra={<GiftOutlined />} bordered={false}>
              <p>{fakeData.overview.products}</p>
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ thống kê */}
        <Row gutter={16}>
          <Col span={12}>
            <Card style={{ marginTop: "20px" }} title="Doanh thu theo tháng"><Line {...revenueConfig} /></Card>
          </Col>
          <Col span={12}>
            <Card style={{ marginTop: "20px" }} title="Đơn hàng theo trạng thái"><Pie {...orderStatusConfig} /></Card>
          </Col>
        </Row>

        {/* Đơn hàng gần đây */}
        <Card style={{ marginTop: "20px" }} title="Đơn hàng gần đây">
          <Table
            columns={orderColumns}
            dataSource={fakeData.recentOrders.map(order => ({ ...order, key: order.id }))}
            pagination={false}
          />
        </Card>

        {/* Sản phẩm sắp hết hàng */}
        <Card style={{ marginTop: "20px" }} title="Sản phẩm sắp hết hàng">
          <List
            dataSource={fakeData.lowStockProducts}
            renderItem={(item) => <List.Item key={item.name}>{item.name} - {item.stock} sản phẩm</List.Item>}
          />
        </Card>

        {/* Khách hàng mới đăng ký */}
        <Card style={{ marginTop: "20px" }} title="Khách hàng mới">
          <List
            dataSource={fakeData.newCustomers}
            renderItem={(item) => <List.Item key={item.email}>{item.name} - {item.email}</List.Item>}
          />
        </Card>

        {/* Thông báo */}
        {fakeData.notifications.map((note) => (
          <Alert key={note.message} message={note.message} type={note.type} showIcon className="dashboard-alert" />
        ))}
      </Content>
    </Layout>
  );
}

export default DashBoard;
