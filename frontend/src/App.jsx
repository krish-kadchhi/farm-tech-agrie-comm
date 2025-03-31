import Navbar from "./components/navbarUser.jsx";
import Layout from "./components/fixLayoutUser.jsx";
import Profile from "./components/profile.jsx";
import Home from "./components/home.jsx";
import ShowCart from "./components/showCart.jsx";
import Signup from "./components/Signup.jsx";
import ProductShow from "./components/showProducts.jsx";
import Fruit from "./components/fruit.jsx";
import Login from "./components/login.jsx";
import Checkout from "./components/checkout.jsx";
import OrderConfirmation from "./components/orderConfirmation.jsx";
import Orders from "./components/orders.jsx";
import AdminNavbar from "./components/admin.jsx";
import AddProduct from "./components/addProducts.jsx";
import Grain from "./components/grains.jsx";
import Vegetable from "./components/vegetable.jsx";
import VerifyOtp from "./components/verifyOtp.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import FarmerDashboard from "./components/FarmerDashboard.jsx";
import EditProducts from "./components/editProducts.jsx";
import { Toaster } from 'sonner';

import "./index.css";
import axios from "axios";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard.jsx";
export default function App() {
   axios.defaults.withCredentials = true;
  return (
    <>
      <BrowserRouter>
        <Layout/>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<h1>Contact Page</h1>} />
            <Route path="/showcart" element={<ShowCart />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<ProductShow />} />
            <Route path="/fruit" element={<Fruit />} />
            <Route path="/grain" element={<Grain />} />
            <Route path="/vegetable" element={<Vegetable />} />
            <Route path="/order-confirm" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* <Route path="/order-confirm" element={<OrderConfirm />} /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminNavbar />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/verifyOtp" element={<VerifyOtp />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/Fdashboard" element={<FarmerDashboard />} />
            <Route path="/editproducts" element={<EditProducts />} />
          </Routes>
      </BrowserRouter>
      <Toaster richColors position='top-center' duration={1500} closeButton />

    </>
  );
}