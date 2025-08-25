import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  Box,
  Paper,
  Avatar,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = ['Review Cart', 'Shipping Details', 'Payment'];
  const activeStep = 2; // Payment step

  useEffect(() => {
    // Check for cart items from location state (new logic)
    if (location.state?.cartItems) {
      setCartItems(location.state.cartItems);
      setLoading(false);
    } else {
      // Fetch cart items if not provided in location state
      fetchCartItems();
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("https://farm-tech-agrie-comm.onrender.com/auth/profile", { withCredentials: true });
        if (res?.data?.user) {
          setUserData(res.data.user);
        } else {
          navigate("/signup");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        navigate("/signup");
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("https://farm-tech-agrie-comm.onrender.com/cart/showCart", {
        withCredentials: true
      });
      
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
      setError("Error fetching cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    setTotal(newTotal);
  };

  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    try {
      setProcessingPayment(true);
      setError(null);
      
      // Get user ID - combined approach from both code snippets
      const user_id = userData?._id || userData?.user_id || userData?.id;
      
      if (!user_id) {
        console.error("User ID not found!");
        setError("Unable to identify user. Please log in again.");
        setProcessingPayment(false);
        return;
      }

      // Ensure Razorpay script is loaded
      if (!window.Razorpay) {
        await loadRazorpay();
      }

      // Create order
      const orderResponse = await axios.post(
        "https://farm-tech-agrie-comm.onrender.com/payment/checkout",
        {
          amount: total,
          cartItems,
          userId: user_id
        },
        { withCredentials: true }
      );

      if (!orderResponse.data || !orderResponse.data.orderId) {
        throw new Error("Failed to create order. Please try again.");
      }

      const { orderId, amount } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: "rzp_test_0vFqP0M0VZhbTj",
        amount: amount * 100,
        currency: "INR",
        name: "Farm Tech",
        description: "Purchase from Farm Tech",
        order_id: orderId,
        handler: async function (response) {
          try {
            const totalQuantity = cartItems.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            );
            const paymentData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amount,
              quantity: totalQuantity,
              cartItems,
              userId: user_id
            };
            
            // Fixed typo in URL from second code snippet
            const verificationResponse = await axios.post(
              "https://farm-tech-agrie-comm.onrender.com/payment/verify-payment", 
              paymentData,
              { withCredentials: true }
            );
            
            if (verificationResponse.data.success) {
              navigate("/order-confirm");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setError("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: userData.name || "Customer",
          email: userData.email || "",
          contact: userData.phone || ""
        },
        theme: { color: "#4caf50" },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      // Initialize Razorpay and open payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setError("Payment failed: " + response.error.description);
        setProcessingPayment(false);
      });
      
      razorpay.open();
    } catch (error) {
      console.error("Payment processing error:", error);
      setError("Failed to process payment: " + (error.message || "Unknown error"));
      setProcessingPayment(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Container maxWidth="md" sx={{ my: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#f8f9fa', py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 2, color: 'success.light' }} />
          <Typography variant="h5" component="h1" fontWeight="500">
            Complete Your Purchase
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>
        ) : (
          <Box sx={{ p: 3 }}>
            {cartItems.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                Your cart is empty. Please add items before checkout.
              </Alert>
            ) : (
              <>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReceiptIcon sx={{ mr: 1 }} /> Order Summary
                </Typography>
                
                <Paper variant="outlined" sx={{ mb: 4, maxHeight: '300px', overflow: 'auto' }}>
                  <List disablePadding>
                    {cartItems.map((item, index) => (
                      <ListItem key={index} sx={{ py: 2, px: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {item.image ? (
                                <Avatar 
                                  src={item.image} 
                                  alt={item.item}
                                  variant="rounded"
                                  sx={{ width: 50, height: 50, mr: 2 }}
                                />
                              ) : (
                                <Avatar 
                                  variant="rounded"
                                  sx={{ width: 50, height: 50, mr: 2, bgcolor: 'success.light' }}
                                >
                                  {item.item?.charAt(0) || '?'}
                                </Avatar>
                              )}
                              <Typography variant="body1" fontWeight="medium">
                                {item?.item || "Product"}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4} sm={2} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                            <Chip 
                              label={`Qty: ${item?.quantity || 0}`} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderColor: 'success.main' }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={2} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                            <Typography variant="body2" color="success.main">
                              {formatPrice(item?.price || 0)} each
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {formatPrice((item?.price || 0) * (item?.quantity || 0))}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShippingIcon sx={{ mr: 1 }} /> Shipping Information
                      </Typography>
                      
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        {userData && userData.address ? (
                          <Box>
                            <Typography variant="body1" gutterBottom fontWeight="medium">
                              {userData.name || 'Customer'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {userData.address}
                              </Typography>
                            </Box>
                            {userData.phone && (
                              <Typography variant="body2" color="text.secondary">
                                Phone: {userData.phone}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography color="text.secondary">
                            No shipping address available. Please update your profile.
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1 }} /> Payment Details
                      </Typography>
                      
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                          <Typography variant="body2">{formatPrice(total)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Shipping:</Typography>
                          <Typography variant="body2">Free</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Tax:</Typography>
                          <Typography variant="body2">Included</Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold" color="success.main">Total:</Typography>
                          <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                            {formatPrice(total)}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={handlePay}
                          disabled={processingPayment || cartItems.length === 0}
                          sx={{ 
                            py: 0.8, 
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                            fontWeight: 'medium'
                          }}
                          startIcon={processingPayment ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                        >
                          {processingPayment ? 'Processing...' : `Pay ${formatPrice(total)}`}
                        </Button>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Checkout;