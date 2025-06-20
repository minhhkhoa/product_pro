import { useCallback, useEffect, useState } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  Card,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchDataProduct } from "../../../api/admin";
import Notification from "../../../utils/Notification";
import { Link } from "react-router-dom";

const { Text } = Typography;

export default function Invoice() {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const items = Form.useWatch("items", form);
  const discountTotal = Form.useWatch("discount_total", form);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    const payload = {
      items: values.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        line_total:
          (item.unit_price || 0) * (item.quantity || 0) -
          ((item.discount || 0) *
            (item.unit_price || 0) *
            (item.quantity || 0)) /
            100,
      })),
      sub_total: values.sub_total,
      discount_total: values.discount_total,
      total_amount: values.total_amount,
    };

    try {
      const res = await fetch(
        "http://localhost:3000/admin/invoice/createInvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        Notification("error", "Lỗi", "Đã xảy ra lỗi không mong muốn!");
        throw new Error("Failed to create invoice");
      }

      const data = await res.json();
      if (!data) {
        Notification("error", "Lỗi", "Đã xảy ra lỗi không mong muốn!");
        throw new Error("Failed to create invoice");
      }
      Notification("success", "Thành công", `Hóa đơn đã được tạo thành công!`);
    } catch (error) {
      Notification("error", "Lỗi", "Đã xảy ra lỗi không mong muốn!");
      console.error("Error creating invoice:", error);
    }
  };

  useEffect(() => {
    const sub = (items || []).reduce((sum, item) => {
      if (!item) return sum;
      const line =
        (item.unit_price || 0) *
        (item.quantity || 0) *
        (1 - (item.discount || 0) / 100);
      return sum + line;
    }, 0);

    const total = sub * (1 - (discountTotal || 0) / 100);

    form.setFieldsValue({
      sub_total: parseFloat(sub.toFixed(2)),
      total_amount: parseFloat(Math.max(total, 0).toFixed(2)),
    });
  }, [items, discountTotal, form]);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchDataProduct();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <h1 className="namePage">Tạo hóa đơn</h1>
      <Card bordered={false} className="form-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            items: [
              {
                product_id: undefined,
                quantity: 1,
                unit_price: 0,
                discount: 0,
              },
            ],
            discount_total: 0,
          }}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <>
                    <Row gutter={8} key={field.key} align="middle">
                      <Col span={6}>
                        <Form.Item
                          name={[field.name, "product_id"]}
                          fieldKey={[field.fieldKey, "product_id"]}
                          label="Sản phẩm: "
                          rules={[
                            { required: true, message: "Hãy chọn 1 sản phẩm" },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Chọn sản phẩm"
                            options={products?.map((p) => ({
                              value: p._id,
                              label: p.title,
                              unit_price: p.price,
                              discount: p.discountPercentage,
                            }))}
                            onChange={(value, option) => {
                              const items = form.getFieldValue("items") || [];
                              items[index] = {
                                ...items[index],
                                unit_price: option.unit_price,
                                discount: option.discount,
                              };
                              form.setFieldsValue({ items });
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          name={[field.name, "quantity"]}
                          fieldKey={[field.fieldKey, "quantity"]}
                          label="Số lượng: "
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={1} value={1} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          name={[field.name, "unit_price"]}
                          fieldKey={[field.fieldKey, "unit_price"]}
                          label="Giá:"
                        >
                          <InputNumber disabled />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          name={[field.name, "discount"]}
                          fieldKey={[field.fieldKey, "discount"]}
                          label="Giảm giá (%): "
                        >
                          <InputNumber disabled />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label="Thành tiền:">
                          <Text>
                            {(() => {
                              const items = form.getFieldValue("items") || [];
                              const item = items[index] || {};
                              const total =
                                (item.unit_price || 0) *
                                (item.quantity || 0) *
                                (1 - (item.discount || 0) / 100);
                              return total.toFixed(2);
                            })()}
                          </Text>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        {index > 0 && (
                          <Button
                            className="btn btnDelete"
                            type="primary"
                            danger
                            onClick={() => remove(field.name)}
                          >
                            <DeleteOutlined />
                          </Button>
                        )}
                      </Col>
                    </Row>

                    <Divider />
                  </>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    style={{ width: "30%" }}
                    type="dashed"
                    onClick={() =>
                      add({ quantity: 1, unit_price: 0, discount: 0 })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm sản phẩm
                  </Button>
                </div>
              </>
            )}
          </Form.List>

          <Divider />
          <Row gutter={16}>
            {/* <Col span={6} /> */}
            <Col span={8}>
              <Form.Item name="sub_total" label="Tổng tiền: ">
                <InputNumber disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discount_total" label="thêm giảm giá (%): ">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="total_amount" label="Tổng thành tiền: ">
                <InputNumber disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              style={{ color: "white", backgroundColor: "blue" }}
              htmlType="submit"
            >
              Lưu hóa đơn
            </Button>

            <Link to={"/admin/invoice"}>
              <Button>Trở về</Button>
            </Link>
          </div>
        </Form>
      </Card>
    </>
  );
}
