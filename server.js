const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRoutes = require("./routes/auth");
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/v1/auth", authRoutes);
app.get("/health", (req, res) => {
  res.json("status:active");
});

app.listen(4000, () => {
  console.log("server is running !!");
});
