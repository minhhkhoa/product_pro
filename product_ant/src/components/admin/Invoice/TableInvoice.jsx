import { useEffect, useRef, useState } from "react";
import {
  Table,
  Typography,
  Space,
  Button,
  message,
  Drawer,
  Modal,
  Input,
} from "antd";
import moment from "moment";
import InvoiceDetail from "./InvoiceDetail";
import Notification from "../../../utils/Notification";
import Highlighter from "react-highlight-words";
import { DeleteOutlined, EyeFilled, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const TableInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "invoice_number",
      key: "invoice_number",
      ...getColumnSearchProps("invoice_number"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Tổng chưa giảm",
      dataIndex: "sub_total",
      key: "sub_total",
      render: (value) =>
        Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      title: "Giảm tổng (%)",
      dataIndex: "discount_total",
      key: "discount_total",
      render: (value) => `${value}%`,
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value) =>
        Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            className="btn"
            onClick={() => handleView(record.invoice_number)}
          >
            <EyeFilled />
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => showDeleteModal(record.invoice_number)}
            className="btn"
            style={{ borderColor: "red" }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const showDeleteModal = (id) => {
    setSelectedInvoice(id);
    setIsDeleteModalVisible(true);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3000/admin/invoice/getAllInvoice"
      );
      if (!res.ok) throw new Error("Lấy hóa đơn thất bại");
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleView = (invoiceNumber) => {
    setSelectedInvoice(invoiceNumber);
    setDrawerOpen(true); // mở drawer
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/admin/invoice/deleteInvoice/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchInvoices();
    } catch (err) {
      console.error(err);
      message.error("Xóa hóa đơn thất bại");
    }
  };

  const confirm = () => {
    handleDelete(selectedInvoice);
    Notification("success", "Thành công", `Hóa đơn đã được xóa thành công!`);
    setIsDeleteModalVisible(false);
  };

  return (
    <div>
      <Title level={4}>Danh sách hóa đơn</Title>
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={invoices}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Drawer
        title="Chi tiết hóa đơn"
        width={720}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedInvoice && <InvoiceDetail invoice_number={selectedInvoice} />}
      </Drawer>

      <Modal
        title="Thông báo"
        open={isDeleteModalVisible}
        onOk={confirm}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa hóa đơn này không?</p>
      </Modal>
    </div>
  );
};

export default TableInvoice;
