import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { 
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  ShoppingBag as ShoppingIcon,
  Home as HomeIcon
} from '@mui/icons-material';

function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const token = Cookies.get('loginCookie');
        if (!token) {
          navigate('/signup');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded._id;

        const response = await axios.get(`http://localhost:8080/orders/latest/${userId}`, {
          withCredentials: true
        });

        setOrderDetails(response.data.order);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!orderDetails) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="info">No order found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography color="text.secondary">
            Thank you for your purchase
          </Typography>
        </Box>

        <Card sx={{ mb: 4, bgcolor: 'success.light' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Order Details</Typography>
              <Chip 
                label={orderDetails.orderStatus}
                color="success"
                variant="outlined"
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography color="text.secondary">Order ID</Typography>
                <Typography variant="body1">{orderDetails.orderId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Payment ID</Typography>
                <Typography variant="body1">{orderDetails.paymentId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Total Amount</Typography>
                <Typography variant="h6" color="success.main">
                  ₹{orderDetails.totalAmount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Order Date</Typography>
                <Typography variant="body1">
                  {new Date(orderDetails.orderDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ShoppingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Items Ordered
            </Typography>
            <List>
              {orderDetails.items.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={item.item}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body1">₹{item.price}</Typography>
                  </ListItem>
                  {index < orderDetails.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Shipping Address
            </Typography>
            <Typography color="text.secondary">
              {orderDetails.shippingAddress}
            </Typography>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingIcon />}
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderConfirmation;