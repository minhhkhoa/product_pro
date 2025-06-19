import { useState, useEffect, useMemo } from "react";
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
  Row,
  Col,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import "./style.css";
import Notification from "../../../../../utils/Notification";
import { getDataCategory, editItem } from "../../../../../api/admin/index";
import { Link, useLocation } from "react-router-dom";

const { Option } = Select;

const EditProduct = ({ onProductUpdated }) => {
  const location = useLocation();
  const data = useMemo(() => location.state?.data || {}, [location.state]);

  const [dataCategory, setDataCategory] = useState([]);
  const [editorContent, setEditorContent] = useState(data.description || "");
  const [fileList, setFileList] = useState([]);
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

  // Populate form when data changes
  useEffect(() => {
    form.setFieldsValue({
      title: data.title,
      product_category_id: data.product_category_id,
      featured: data.featured?.toString() || "0",
      price: data.price,
      discountPercentage: data.discountPercentage,
      stock: data.stock,
      position: data.position,
      status: data.status,
    });
    setEditorContent(data.description || "");
    if (data.thumbnail) {
      setFileList([
        {
          uid: "-1",
          name: "thumbnail.png",
          status: "done",
          url: data.thumbnail,
        },
      ]);
    }
  }, [data, form]);

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
      if (fileList[0]?.originFileObj) {
        formData.append("thumbnail", fileList[0].originFileObj);
      }

      await editItem(formData, data._id, "products");
      onProductUpdated?.();
    } catch {
      Notification("error", "Lỗi", "Cập nhật sản phẩm thất bại!");
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
    // preview logic omitted or use a lightbox component
  };

  return (
    <>
      <h1 className="namePage">Chỉnh sửa sản phẩm</h1>
      <Card className="create-product-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ featured: "0", status: "active" }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tên sản phẩm:"
                rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
              >
                <Input placeholder="Tên sản phẩm" />
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

              <Form.Item name="price" label="Giá (USD):">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="discountPercentage" label="Giảm giá (%):">
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
                  <Radio value="inactive">Dừng hoạt động</Radio>
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
                style={{ backgroundColor: "blue", color: "white" }}
                htmlType="submit"
              >
                Lưu thay đổi
              </Button>

              <Link to={`/admin/products`}>
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

EditProduct.propTypes = {
  onProductUpdated: PropTypes.func,
};

export default EditProduct;
