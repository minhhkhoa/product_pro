const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

//- cors se giup ket noi 2 server
const cors = require("cors");
app.use(cookieParser()); // ✅ Đọc cookie từ request

app.use(cors({
  origin: ["http://localhost:5173", "https://product-qetdq7i34-minhkhoas-projects.vercel.app/"],
  credentials: true, // ✅ Cho phép gửi cookie
}));

// app.use(cors({
//   origin: 'http://localhost:5173', // Địa chỉ frontend
//   credentials: true // Quan trọng! Cho phép gửi cookie từ backend về frontend
// }));

//-.env 
require("dotenv").config();
//-connect database
const dataBase = require("./config/database");
dataBase.connect();

//-connect route
const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

//start thay thế cho body-parser
// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Middleware để xử lý dữ liệu form-urlencoded
app.use(express.urlencoded({ extended: true }));
//end thay thế cho body-parser


routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})