const fakeData = {
  overview: {
    orders: 152,
    revenue: 50000000,
    customers: 10300,
    products: 1250,
  },
  monthlyRevenue: [30, 50, 45, 70, 90, 85, 100, 120, 150, 170, 190, 200],
  orderStatus: [
    { type: "Đang xử lý", value: 40 },
    { type: "Đã giao", value: 120 },
    { type: "Đã hủy", value: 15 },
  ],
  recentOrders: [
    { id: "ORD12345", customer: "Nguyễn Văn A", total: 3000000, status: "Đã giao", date: "01/02/2025" },
    { id: "ORD12346", customer: "Trần Thị B", total: 500000, status: "Đang xử lý", date: "02/02/2025" },
    { id: "ORD12347", customer: "Lê Văn C", total: 1200000, status: "Đã giao", date: "03/02/2025" },
  ],
  lowStockProducts: [
    { name: "iPhone 15 Pro", stock: 3, price: 29000000 },
    { name: "Laptop Asus", stock: 5, price: 25000000 },
  ],
  newCustomers: [
    { name: "Minh Khoa", email: "minhkhoa@gmail.com", date: "02/02/2025" },
    { name: "Chúc Ngọc", email: "chucngoc@gmail.com", date: "03/02/2025" },
  ],
  notifications: [
    { message: "Có 5 đơn hàng mới cần xử lý!", type: "warning" },
    { message: "iPhone 15 Pro sắp hết hàng!", type: "error" },
  ],
};

export default fakeData;
