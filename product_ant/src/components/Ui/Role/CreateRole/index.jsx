import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons'; // Thêm import icon
import { Editor } from '@tinymce/tinymce-react';
import "./style.css";
import Notification from '../../../../utils/Notification';


// eslint-disable-next-line react/prop-types
function CreateRole({ resetData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [form] = Form.useForm();


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
      const res = await fetch("http://localhost:3000/admin/roles/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Đặt header để chỉ định dữ liệu JSON
        },
        body: JSON.stringify(values), // Chuyển đổi đối tượng thành chuỗi JSON
      });

      if (res.ok) {
        if (resetData) resetData(); // Gọi callback để load lại dữ liệu
        form.resetFields(); // Reset form
        Notification("success", "Thành công", "Nhóm quyền đã được thêm thành công!");
      } else {
        Notification("error", "Lỗi", "Đã có lỗi xảy ra khi tạo nhóm quyền!");
      }
    } catch (error) {
      console.log('Đã có lỗi xảy ra!', error);
      Notification("error", "Lỗi", "Đã có lỗi xảy ra khi tạo nhóm quyền!");
    }
  };


  return (
    <>
      <Button
        className='btnCreateRole'
        type="primary"
        onClick={showModal}
      >
        <PlusOutlined />
        Thêm mới
      </Button>
      <Modal
        title="Thêm nhóm quyền mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="create-product"
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên nhóm quyền"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input your title!',
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
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default CreateRole;