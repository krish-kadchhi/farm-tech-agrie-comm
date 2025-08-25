const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const Item = require("./models/item.js");
const Cart = require("./models/cart.js");
const User = require("./models/user.js");
const Order = require("./models/order.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const { render, cookie } = require("express/lib/response.js");
const cors = require("cors");
const bodyparser = require("body-parser");
const { name } = require("ejs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://farm-tech-agrie-comm-frontend.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Explicitly handle preflight requests
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
//database url
const MONGO_URL = process.env.MONGODB_URI;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(express.static("public")); // Serve static files

const authRoutes = require("./routes/authRoutes.js");
const itemRoutes = require("./routes/itemRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

app.use("/auth", authRoutes);
app.use("/item", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/orders", orderRoutes);



app.listen(port, () => {
  console.log(`port is listing in ${port}`);
});

module.exports = app;
