/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Upload,
  Button,
  Spin,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import "./style.css";
import Notification from "../../../../../utils/Notification";
import { getDataCategory, createItem } from "../../../../../api/admin/index";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const CreateProduct = ({ onProductCreated }) => {
  const [dataCategory, setDataCategory] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const list = await getDataCategory("flat");
        setDataCategory(list);
      } catch {
        Notification("error", "Lỗi", "Không tải được danh mục");
      }
    })();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries({
        title: values.title,
        product_category_id: values.product_category_id,
        featured: values.featured,
        description: editorContent,
        price: values.price,
        discountPercentage: values.discountPercentage,
        stock: values.stock,
        position: values.position || "",
        status: values.status,
      }).forEach(([key, val]) => formData.append(key, val));
      if (fileList[0]?.originFileObj)
        formData.append("thumbnail", fileList[0].originFileObj);

      await createItem(formData, setLoading, "products");
      // Notification("success", "Thành công", "Đã tạo sản phẩm!");
      form.resetFields();
      setFileList([]);
      setEditorContent("");
      onProductCreated?.();
    } catch (err) {
      console.log(err);
      Notification("error", "Lỗi", "Tạo sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList: newList }) => setFileList(newList);
  const getBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result);
      reader.onerror = (e) => rej(e);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <h1 className="namePage">Thêm Sản Phẩm</h1>
      <Card className="create-product-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "active", featured: "0" }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tên sản phẩm:"
                rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
              >
                <Input placeholder="Ví dụ: Áo thun cổ tròn" />
              </Form.Item>

              <Form.Item
                name="product_category_id"
                label="Danh mục:"
                rules={[{ required: true, message: "Chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {dataCategory.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="featured" label="Đặt nổi bật:">
                <Radio.Group>
                  <Radio value="1">Có</Radio>
                  <Radio value="0">Không</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá (USD):"
                rules={[{ required: true, message: "Nhập giá!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="discountPercentage" label="Giảm giá (%)">
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="stock"
                label="Số lượng:"
                rules={[{ required: true, message: "Nhập số lượng!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ảnh sản phẩm:">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false}
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item name="position" label="Vị trí (tùy chọn):">
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Tự tăng nếu để trống"
                />
              </Form.Item>

              <Form.Item name="status" label="Trạng thái:">
                <Radio.Group>
                  <Radio value="active">Hoạt động</Radio>
                  <Radio value="inactive">Dừng</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả:">
            <Editor
              apiKey="tlv55er0rp1owbi1sqrk0s9ha1v7xxnbir624071vyp33l2h"
              value={editorContent}
              onEditorChange={setEditorContent}
              init={{
                plugins: "autolink lists link image table code",
                toolbar:
                  "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | code",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ display: "flex", flexDirection: "row-reverse" }}>
              <Button
                style={{ color: "white", backgroundColor: "blue" }}
                htmlType="submit"
              >
                Lưu và thêm tiếp
              </Button>
              <Link to={"/admin/products"}>
                <Button>Trở về</Button>
              </Link>
            </Space>
          </Form.Item>
        </Form>
        {loading && (
          <div
            className="loading-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <Spin size="large" />
          </div>
        )}
      </Card>
    </>
  );
};

CreateProduct.propTypes = {
  onProductCreated: PropTypes.func,
};

export default CreateProduct;
