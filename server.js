const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('dotenv').config();
// const dbstart=process.env.DB_LOCAL;
const dbstart=process.env.db_server;

mongoose
  .connect(dbstart)
  .then(() => console.log("Connected to MongoDB!"));



const accountRoutes = require("./routes/accountroutes");
const categoryRoutes = require("./routes/categoryroutes");
const resetRoutes = require("./routes/resetpassroutes");
const subcatRoutes = require("./routes/subcatRoutes");
const productRoutes=require("./routes/productroutes");
const cartRoutes=require("./routes/cartroutes");
const OrderRoutes=require("./routes/orderRoutes");
// Use routes
app.use("/api", accountRoutes);
app.use("/api", categoryRoutes);
app.use("/api", resetRoutes);
app.use("/api", subcatRoutes);
app.use("/api", productRoutes);
app.use("/api",cartRoutes);
app.use("/api",OrderRoutes);


// Start server
app.listen(9000, () => {
  console.log("Server is running");
});
