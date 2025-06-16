import { useCallback, useEffect, useState } from "react";
import { Card, Descriptions, Table, Typography, Spin, Alert } from "antd";
import PropTypes from "prop-types";

const { Title } = Typography;

const InvoiceDetail = ({ invoice_number }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoice = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/admin/invoice/${invoice_number}`
      );
      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu hóa đơn");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [invoice_number]);

  useEffect(() => {
    if (invoice_number) {
      fetchInvoice();
    }
  }, [invoice_number, fetchInvoice]);

  if (loading) return <Spin tip="Đang tải dữ liệu..." />;
  if (error) return <Alert type="error" message="Lỗi" description={error} />;

  const columns = [
    {
      title: "Sản phẩm:",
      dataIndex: "product_id",
      key: "product_id",
    },
    {
      title: "Số lượng:",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá:",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Giảm giá (%):",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Thành tiền:",
      dataIndex: "line_total",
      key: "line_total",
      render: (total) => `${total.toFixed(2)} đ`,
    },
  ];

  return (
    <Card bordered>
      <Title level={4}>Chi tiết Hóa đơn</Title>

      <Descriptions bordered size="middle" column={2}>
        <Descriptions.Item label="Số hóa đơn">
          {data.invoice_number}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(data.date).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền trước giảm giá">
          {data.sub_total.toFixed(2)} đ
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá hóa đơn (%)">
          {data.discount_total}%
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền thanh toán" span={2}>
          <strong>{data.total_amount.toFixed(2)} đ</strong>
        </Descriptions.Item>
      </Descriptions>

      <Title level={5} style={{ marginTop: 24 }}>
        Danh sách sản phẩm
      </Title>
      <Table
        columns={columns}
        dataSource={data.items}
        rowKey="_id"
        pagination={false}
      />
    </Card>
  );
};

export default InvoiceDetail;

InvoiceDetail.propTypes = {
  invoice_number: PropTypes.string.isRequired,
};
