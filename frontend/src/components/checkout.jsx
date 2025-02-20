import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Grid,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("loginCookie");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("decoded token", decoded);
      setUserData(decoded);
    } else {
      navigate("/signup");
    }
  }, [navigate]);
  useEffect(() => {
    const token = Cookies.get("loginCookie");
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartItems();
  }, []);
  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);
  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cart/showCart");
      console.log("API Response:", response.data); 

      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cart/showCart");
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      setError("Error fetching cart items.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };
  const calculateTotal = () => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handlePay = async () => {
    try {
      const userId = Cookies.get("userId");
      console.log("User ID:", userId);
      const orderResponse = await axios.post(
        "http://localhost:8080/payment/checkout",
        {
          amount: total,
          cartItems,
          userId,
        },
        {
          withCredentials: true, // For sending cookies
        }
      );
  const handlePay = async () => {
    try {
      const userId = Cookies.get("userId");
      const orderResponse = await axios.post(
        "http://localhost:8080/payment/checkout",
        {
          amount: total,
          cartItems,
          userId,
        },
        { withCredentials: true }
      );

      // console.log("Order Response:", orderResponse.data);
      const { orderId, amount } = orderResponse.data;
      const { orderId, amount } = orderResponse.data;

      const options = {
        key: "rzp_test_0vFqP0M0VZhbTj", // Replace with your Razorpay key_id
        amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Farm Tech",
        description: "Test Transaction",
        order_id: orderId, // This is the order_id created in the backend
        callback_url: "http://localhost:3000/payment/verify-payment", // Your success URL

        handler: async function (response) {
          const totalQuantity = cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: amount,
            quantity: totalQuantity,
            cartItems,
            userId,
          };
          const api = await axios.post(
            "http://localhost:8080/payment/verify-payment",
            paymentData
          );

          if (api.data.success) {
            navigate("/order-confirm");
          }
        },
        prefill: {
          name: "Dev Bhimani",
          email: "devbhimani1111@gmail.com",
          contact: "9265608316",
        },
        theme: {
          color: "green",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error paying:", error);
    }
  };
      const options = {
        key: "rzp_test_0vFqP0M0VZhbTj",
        amount: amount * 100,
        currency: "INR",
        name: "Farm Tech",
        description: "Test Transaction",
        order_id: orderId,
        callback_url: "http://localhost:3000/payment/verify-payment",
        handler: async function (response) {
          const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: amount,
            quantity: totalQuantity,
            cartItems,
            userId,
          };
          const api = await axios.post("http://localhost:8080/payment/verify-payment", paymentData);
          if (api.data.success) {
            navigate("/order-confirm");
          }
        },
        prefill: {
          name: "Dev Bhimani",
          email: "devbhimani1111@gmail.com",
          contact: "9265608316",
        },
        theme: { color: "green" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <ul>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <li key={index}>
              {item?.item ?? "No Name"} - Quantity: {item?.quantity ?? 0} price:{" "}
              {item?.price ?? 0} total: {item?.price * item?.quantity ?? 0}
            </li>
          ))
        ) : (
          <p>No items in cart.</p>
        )}
      </ul>

      {userData && <p>Shipping Address: {userData.address}</p>}
      <button onClick={handlePay}>Pay {total}</button>
    </div>
  );
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <List>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <ListItem key={index} divider>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6}>
                        <Typography variant="body1">{item?.item ?? "No Name"}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2">Qty: {item?.quantity ?? 0}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2">₹{item?.price ?? 0}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2">Total: ₹{item?.price * item?.quantity ?? 0}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))
              ) : (
                <Typography align="center">No items in cart.</Typography>
              )}
            </List>
            <Divider sx={{ my: 2 }} />
            {userData && (
              <Typography variant="body1" gutterBottom>
                <strong>Shipping Address:</strong> {userData.address}
              </Typography>
            )}
            <Typography variant="h5" align="right" sx={{ my: 2 }}>
              Total: ₹{total}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handlePay}
            >
              Pay ₹{total}
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}

export default Checkout;