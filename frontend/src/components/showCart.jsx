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
  subtotalTable: {
    marginBottom: "16px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "24px",
    marginTop: "32px",
  },
  socialIcons: {
    fontSize: "24px",
    marginTop: "8px",
  },
});

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const classes = useStyles();

  const handleCheckoutClick = async()=>{
    try{
      const res = await axios.post("http://localhost:8080/cart/addCart",cartItems,{withCredentials:true});
      if(res.status==200){
        navigate("/checkout");
      }

    }catch(e){
      console.log(e)
    }

  }

  useEffect(() => {
    const firstCookie = Cookies.get("cookie");
    const secondCookie = Cookies.get("loginCookie");
    if (!(firstCookie || secondCookie)) {
      navigate("/signup");
    }
  }, []);

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
        id: uuidv4(), // Ensure each item has a unique id
        quantity: item.quantity || 1,
      }));
      setCartItems(itemsWithQuantity);
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

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = async (item) => {
    try {
      await axios.post(`http://localhost:8080/cart/deleteCart`, {
        item: item.item,
      });
      await fetchCartItems();
    } catch (err) {
      console.error("Error removing item:", err.message);
    }
  };

  return (
    <div className={classes.cartContainer}>
      <section className={classes.cartHeader}>
        <Typography variant="h4">Farm Fresh Cart</Typography>
        <Typography variant="body1">Your Basket of Nature's Best</Typography>
      </section>

      <section className={classes.cartTable}>
        <TableContainer component={Paper} elevation={3}>
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
              {cartItems.map((item) => (
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
                    { item.image ? (
                      <img
                        src={item.image}
                        alt={item.item}
                        className={classes.productImage}
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/50"
                        alt={item.item}
                        className={classes.productImage}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={classes.productName}>{item.item}</span>
                    <br />
                    <small>From Local Farms</small>
                  </TableCell>
                  <TableCell>
                    <span className={classes.priceTag}>₹{item.price}</span>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className={classes.quantityInput}
                    />
                  </TableCell>
                  <TableCell>
                    <span className={classes.priceTag}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section>
        <Grid container justifyContent="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h6">Harvest Total</Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Cart Subtotal</TableCell>
                    <TableCell>₹{total.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shipping</TableCell>
                    <TableCell>Free Farm Delivery</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>
                      <strong>₹{total.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button
                variant="contained"
                color="success"
                fullWidth
                style={{ marginTop: "16px" }}
                onClick={handleCheckoutClick}
              >
                Harvest & Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </section>

      <footer className={classes.footer}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Farm Address:</Typography>
            <Typography variant="body1">Anand, Gujarat</Typography>
            <Typography variant="body1">Phone: +91 1234567890</Typography>
            <Typography variant="body1">Hours: Sunrise to Sunset</Typography>
            <div className={classes.socialIcons}>
              <i className="fa-brands fa-facebook-f"></i>
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-instagram"></i>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">About Our Farm</Typography>
          </Grid>
        </Grid>
      </footer>
    </div>
  );
}