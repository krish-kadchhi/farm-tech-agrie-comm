import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { green } from "@mui/material/colors";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("loginCookie");
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } else {
      navigate("/signup");
    }
  }, [navigate]);


// function Checkout() {
//     const [cartItems, setCartItems] = useState([]);
//       const [total, setTotal] = useState(0);
//         const [userData, setUserData] = useState({});  
//     const navigate = useNavigate();
//     const location = useLocation();
 

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cart/showCart");
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

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

      const { orderId, amount } = orderResponse.data;
      const options = {
        key: "rzp_test_0vFqP0M0VZhbTj",
        amount: amount * 100,
        currency: "INR",
        name: "Farm Tech",
        description: "Test Transaction",
        order_id: orderId,
        callback_url: "http://localhost:3000/payment/verify-payment",
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
          color: green[700],
        },
    
  //   const calculateTotal = () => {
  //       const newTotal = cartItems.reduce(
  //         (sum, item) => sum + item.price * item.quantity,
  //         0
  //       );
  //       setTotal(newTotal);
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  
    }  } catch (error) {
      console.error("Error paying:", error);
    }
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 600, mb: 3 }}>
          Checkout
        </Typography>

        {/* Cart Items Section */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Order Summary
            </Typography>
            <List>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`${item?.item ?? "No Name"} (x${item?.quantity ?? 0})`}
                        secondary={`Price: ₹${item?.price ?? 0} | Total: ₹${item?.price * item?.quantity ?? 0}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography color="text.secondary">No items in cart.</Typography>
              )}
            </List>
          </CardContent>
        </Card>

        {/* Shipping Address Section */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Shipping Address
            </Typography>
            <Typography color="text.secondary">
              {userData?.address ?? "No address available"}
            </Typography>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Total Amount: ₹{total}
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: green[700],
              color: "white",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "30px",
              "&:hover": { bgcolor: green[900] },
            }}
            onClick={handlePay}
            disabled={total === 0}
          >
            Pay ₹{total}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
                   

    return (
      <div>
        <h1>Checkout</h1>
        <ul>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <li key={index}>
                {item?.item ?? "No Name"} - Quantity: {item?.quantity ?? 0} -
                Price: {item?.price ?? 0} - Total:{" "}
                {(item?.price ?? 0) * (item?.quantity ?? 0)}
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
}

export default Checkout;
