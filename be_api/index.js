const express = require('express')
const app = express()
const port = 3000

const cors = require("cors");
app.use(cors());

require("dotenv").config();
//-connect database
const dataBase = require("./config/database");
dataBase.connect();

//-connect route
const routeAdmin = require("./routes/admin/index.route");



routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})