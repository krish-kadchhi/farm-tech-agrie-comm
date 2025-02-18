import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  cartContainer: {
    padding: "24px",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  },
  cartHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  cartTable: {
    marginBottom: "32px",
  },
  productImage: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
  },
  productName: {
    fontWeight: "bold",
  },
  priceTag: {
    fontWeight: "600",
  },
  quantityInput: {
    width: "60px",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "24px",
    marginTop: "32px",
  },
});

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [maxItem, setMaxItem] = useState({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    if (!Cookies.get("loginCookie")) {
      navigate("/signup");
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cart/showCart");
      const itemsWithQuantity = response.data.map((item) => ({
        ...item,
        id: uuidv4(),
        quantity: item.quantity || 1,
      }));
      setCartItems(itemsWithQuantity);

      const response2 = await axios.get("http://localhost:8080/cart/showItem");
      setMaxItem(response2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateTotal = () => {
    setTotal(
      cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      )
    );
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const itemStock = maxItem[item.item] || 999999;
          const parsedQuantity = parseInt(newQuantity) || 1;
          return {
            ...item,
            quantity: Math.min(Math.max(1, parsedQuantity), itemStock),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = async (item) => {
    try {
      await axios.post("http://localhost:8080/cart/deleteCart", {
        item: item.item,
      });
      fetchCartItems();
    } catch (err) {
      console.error("Error removing item:", err.message);
    }
  };

  return (
    <div className={classes.cartContainer}>
      <Typography variant="h4" className={classes.cartHeader}>
        Farm Fresh Cart
      </Typography>
      <TableContainer
        component={Paper}
        elevation={3}
        className={classes.cartTable}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Remove</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Price/Kg</TableCell>
              <TableCell>Quantity(Kg)</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(item)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                  <TableCell>
                    <img
                      src={item.image || "https://via.placeholder.com/50"}
                      alt={item.item}
                      className={classes.productImage}
                    />
                  </TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      inputProps={{
                        min: 1,
                        max: maxItem[item.item],
                      }}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className={classes.quantityInput}
                    />
                  </TableCell>
                  <TableCell>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No items in cart
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" align="right">
        Total: ₹{total.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={() => navigate("/checkout", { state: { cartItems } })}
      >
        Checkout
      </Button>
    </div>
  );
}
