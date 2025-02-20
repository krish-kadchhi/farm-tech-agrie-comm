import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.cartItems) {
      setCartItems(location.state.cartItems);
    }
  }, [location.state]);

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
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    setTotal(newTotal);
  };

  const handlePay = async () => {
    try {
      const user_id = userData?._id;
      if (!user_id) {
        console.error("User ID not found!");
        return;
      }

      const orderResponse = await axios.post(
        "http://localhost:8080/payment/checkout",
        {
          amount: total,
          cartItems,
          userId: user_id,
        },
        { withCredentials: true }
      );

      if (!orderResponse.data.success) {
        console.error("Error creating order:", orderResponse.data.message);
        return;
      }

      const { orderId, amount } = orderResponse.data;

      const options = {
        key: "rzp_test_0vFqP0M0VZhbTj",
        amount: amount * 100,
        currency: "INR",
        name: "Farm Tech",
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
          console.log("Razorpay Response:", response);

          const totalQuantity = cartItems.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );

          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount,
            quantity: totalQuantity,
            cartItems,
            userId: user_id,
          };

          const verifyResponse = await axios.post(
            "http://localhost:8080/payment/verify",
            paymentData
          );

          if (verifyResponse.data.success) {
            navigate("/order-confirm");
          } else {
            console.error("Payment verification failed!");
          }
        },
        prefill: {
          name: userData?.name || "User",
          email: userData?.email || "user@example.com",
          contact: userData?.phone || "0000000000",
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
              {item?.item ?? "No Name"} - Quantity: {item?.quantity ?? 0} -
              Price: {item?.price ?? 0} - Total:{" "}
              {(item?.price || 0) * (item?.quantity || 0)}
            </li>
          ))
        ) : (
          <p>No items in cart.</p>
        )}
      </ul>

      {userData?.address && <p>Shipping Address: {userData.address}</p>}
      <button onClick={handlePay}>Pay {total}</button>
    </div>
  );
}

export default Checkout;
