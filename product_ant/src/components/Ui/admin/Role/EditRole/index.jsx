import { useEffect, useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons"; // Thêm import icon
import { Editor } from "@tinymce/tinymce-react";
import "./style.css";
import Notification from "../../../../../utils/Notification";
import PropTypes from "prop-types";
import { editItem } from "../../../../../api/admin";

// eslint-disable-next-line react/prop-types
function EditRole({ fetchDataRoles, data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (data && form) {
      //-nếu data thay đổi
      if (isModalOpen) {
        //-nếu model đã được mở
        form.setFieldsValue({
          //- mới bắt đầu gán dữ liệu vào form
          title: data?.title || "",
        });
      }
    }
  }, [data, form, isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    values.description = editorContent; // Thêm mô tả từ editor
    try {
      await editItem(values, data._id, "roles", true); //- tham số thứ 4 để xác định gửi dữ liệu dạng JSON

      form.resetFields(); // Reset form
      fetchDataRoles(); // Gọi callback để load lại dữ liệu
    } catch (error) {
      console.log("Đã có lỗi xảy ra!", error);
      Notification("error", "Lỗi", "Đã có lỗi xảy ra khi sửa nhóm quyền!");
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="btn btnEdit">
        <EditOutlined />
      </Button>
      <Modal
        title="Chỉnh sửa nhóm quyền"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name={data._id} form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên nhóm quyền"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả nhóm quyền" name="description">
            <Editor
              apiKey="tlv55er0rp1owbi1sqrk0s9ha1v7xxnbir624071vyp33l2h"
              onEditorChange={(newValue) => setEditorContent(newValue)}
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              initialValue={data.description}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default EditRole;

EditRole.propTypes = {
  data: PropTypes.object.isRequired, // Dữ liệu sản phẩm
};
