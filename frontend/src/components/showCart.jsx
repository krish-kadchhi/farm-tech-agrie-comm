import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
  Box,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Container,
  Snackbar,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningIcon from "@mui/icons-material/Warning";
import PaymentIcon from "@mui/icons-material/Payment";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  paddingTop: 16,
  paddingBottom: 16,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.common.white,
  fontWeight: 600,
}));

const ProductImage = styled("img")({
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 8,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

const QuantityControl = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
});

// Custom narrow container with reduced margins
const NarrowContainer = styled(Container)(({ theme }) => ({
  maxWidth: "100%",
  paddingLeft: theme.spacing(2),  // Reduced left margin
  paddingRight: theme.spacing(2), // Reduced right margin
}));

const API_BASE_URL = "http://localhost:8080";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const firstCookie = Cookies.get("cookie");
      const secondCookie = Cookies.get("loginCookie");
      
      if (!(firstCookie || secondCookie)) {
        navigate("/signup");
        return;
      }
      
      await fetchCartItems();
    };
    
    checkAuth();
  }, [navigate]);

  // Calculate total whenever cart items change
  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/showCart`, {
        withCredentials: true,
        timeout: 8000
      });
      
      if (response.data && Array.isArray(response.data)) {
        const itemsWithQuantity = response.data.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setCartItems(itemsWithQuantity);
      } else {
        setCartItems([]);
        setError("No items found in cart");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch cart items");
      console.error("Error fetching cart items:", error);
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

  const handleQuantityChange = (id, newQuantity) => {
    // Prevent negative or zero quantities
    const validQuantity = Math.max(1, parseInt(newQuantity, 10));
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: validQuantity } : item
      )
    );
  };

  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(item.quantity, 10) + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: parseInt(item.quantity, 10) - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = async (item) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/cart/deleteCart`, {
        item: item.item,
      }, {
        withCredentials: true
      });
      
      await fetchCartItems();
      showSnackbar(`${item.item} removed from cart`, "success");
    } catch (err) {
      setError("Failed to remove item");
      showSnackbar("Failed to remove item", "error");
      console.error("Error removing item:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showSnackbar("Your cart is empty", "warning");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/cart/addCart`,
        cartItems,
        { withCredentials: true }
      );
      
      if (res.status === 200) {
        navigate("/checkout", { state: { cartItems } });
      }
    } catch (e) {
      setError("Failed to proceed to checkout");
      showSnackbar("Checkout failed. Please try again", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render empty cart state
  if (!loading && cartItems.length === 0) {
    return (
      <NarrowContainer sx={{ py: 8, minHeight: "80vh" }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom color="text.secondary">
            Your Cart is Empty
          </Typography>
          <Box sx={{ my: 4 }}>
            <img
              src="https://via.placeholder.com/300x200?text=Empty+Cart"
              alt="Empty cart"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="body1" paragraph>
            Looks like you haven't added any fresh produce to your cart yet.
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate("/products")}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      </NarrowContainer>
    );
  }

  return (
    <NarrowContainer sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "success.main",
          }}
        >
          Your Shopping Cart
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "700px", mx: "auto" }}
        >
          Review your selection of premium organic produce
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="success" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Cart Table */}
          <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Product</StyledTableHeadCell>
                  <StyledTableHeadCell>Description</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Price/Kg</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Quantity (Kg)</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Total</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <StyledTableCell>
                      <ProductImage
                        src={item.image || "https://via.placeholder.com/80?text=Produce"}
                        alt={item.item}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.item}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Premium Organic • Locally Sourced
                      </Typography>
                      <Chip 
                        label="Not returnable" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                        icon={<WarningIcon fontSize="small" />}
                        sx={{ mt: 1, fontSize: '0.7rem' }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Typography fontWeight={600}>₹{item.price.toFixed(2)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <QuantityControl>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => decrementQuantity(item.id)}
                          disabled={parseInt(item.quantity, 10) <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          inputProps={{ 
                            min: 1, 
                            step: 1,
                            style: { textAlign: "center", width: "60px" }
                          }}
                          variant="outlined"
                          size="small"
                        />
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => incrementQuantity(item.id)}
                        >
                          <AddIcon />
                        </IconButton>
                      </QuantityControl>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Typography fontWeight={600} color="success.main">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item)}
                        aria-label={`Remove ${item.item} from cart`}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order Summary and Info Sections */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShippingIcon sx={{ mr: 1 }} /> Delivery Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Shipping Policy:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Free delivery for orders above ₹100
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • ₹40 delivery charge for orders below ₹100
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Standard delivery: 1-2 business days
                    </Typography>
                    <Typography variant="body2" color="error">
                      • Express delivery (same day): Additional ₹60
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Return Policy:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      All fresh produce is non-returnable due to perishable nature. We guarantee 
                      freshness at delivery - inspect all items at the time of delivery.
                    </Typography>
                    <Typography variant="body2">
                      In case of quality issues, please take photos and contact our customer 
                      service within 4 hours of delivery.
                    </Typography>
                  </Box>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      We harvest your produce only after order confirmation to ensure maximum freshness.
                    </Typography>
                  </Alert>
                </Paper>
              </Box>
              
              {/* Payment Methods Section */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaymentIcon sx={{ mr: 1 }} /> Payment Methods
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2">Credit/Debit Cards</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2">UPI Payment</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2">Net Banking</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2">Cash on Delivery</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ my: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1">Subtotal</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body1">₹{total.toFixed(2)}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body1">Shipping</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body1" color={total >= 100 ? "success.main" : "error"}>
                        {total >= 100 ? "FREE" : "₹40.00"}
                      </Typography>
                    </Grid>
                    
                    {total < 100 && (
                      <Grid item xs={12}>
                        <Alert severity="info" sx={{ mt: 1 }}>
                          Add ₹{(100 - total).toFixed(2)} more to qualify for free shipping!
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="h6" fontWeight={600}>
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      ₹{(total >= 100 ? total : total + 40).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  disabled={loading || cartItems.length === 0}
                  style={{ marginTop: "16px" }}
                  onClick={() => navigate("/checkout",{state: {cartItems}})}
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </Button>
                
                <Box sx={{ mt: 3, bgcolor: "#f8f8f8", p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy.
                    Your order will be prepared immediately after confirmation.
                  </Typography>
                </Box>
              </Paper>
              
              {/* Estimated Delivery Time */}
              <Paper elevation={2} sx={{ p: 2, mt: 3, bgcolor: "success.light" }}>
                <Typography variant="subtitle2" color="white" align="center">
                  Estimated Delivery: {new Date(Date.now() + 86400000).toLocaleDateString()} - {new Date(Date.now() + 172800000).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NarrowContainer>
  );
}