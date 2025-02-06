const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cookieParser()); // ✅ Đọc cookie từ request

app.use(cors({
  origin: ["http://localhost:5173", "https://product-qetdq7i34-minhkhoas-projects.vercel.app"], // Danh sách các nguồn gốc được phép
  credentials: true, // ✅ Cho phép gửi cookie
}));

require("dotenv").config();
const dataBase = require("./config/database");
dataBase.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
