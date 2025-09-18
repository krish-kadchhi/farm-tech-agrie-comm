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
  Chip,
  useTheme,
  createTheme,
  ThemeProvider
} from '@mui/material';
import API_BASE_URL from "../config/api";
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
  const defaultTheme = useTheme();
  
  // Create a custom theme with green as primary and secondary
  const theme = createTheme({
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      primary: {
        main: '#2e7d32', // Green color
        light: '#4caf50',
        dark: '#1b5e20',
      },
      secondary: {
        main: '#2e7d32', // Also green for secondary
        light: '#4caf50',
        dark: '#1b5e20',
      },
      success: {
        main: '#2e7d32',
        light: '#e8f5e9',
        dark: '#1b5e20',
      }
    },
  });

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

        const response = await axios.get(`${API_BASE_URL}/orders/latest/${userId}`, {
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

  // Format currency properly
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
          <CircularProgress size={50} color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading order details...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <Alert severity="error">{error}</Alert>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" onClick={() => navigate('/products')}>
              Return to Shop
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (!orderDetails) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <Alert severity="info">No order found</Alert>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)'
          }}
        >
          <Box 
            textAlign="center" 
            mb={4} 
            sx={{
              p: 3,
              borderRadius: '12px'
            }}
          >
            <CheckCircleIcon 
              color="primary" 
              sx={{ 
                fontSize: 70, 
                mb: 2,
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }} 
            />
            <Typography variant="h4" gutterBottom fontWeight="600" color="primary.dark">
              Order Confirmed!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Thank you for your purchase
            </Typography>
          </Box>

          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${theme.palette.primary.light}`
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="600">Order Details</Typography>
                <Chip 
                  label={orderDetails.orderStatus}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500, px: 1 }}
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary" variant="subtitle2">Order ID</Typography>
                  <Typography variant="body1" fontWeight="500">{orderDetails.orderId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary" variant="subtitle2">Payment ID</Typography>
                  <Typography variant="body1" fontWeight="500">{orderDetails.paymentId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary" variant="subtitle2">Total Amount</Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="600">
                    {formatCurrency(orderDetails.totalAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary" variant="subtitle2">Order Date</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {new Date(orderDetails.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Items Ordered
              </Typography>
              <List sx={{ pt: 1 }}>
                {orderDetails.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 2, py: 1.5 }}>
                      <ListItemText
                        primary={<Typography fontWeight="500">{item.item}</Typography>}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Box textAlign="right">
                        <Typography variant="body1" fontWeight="medium">{formatCurrency(item.price)}</Typography>
                        {item.quantity > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            ({formatCurrency(item.price / item.quantity)} each)
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                    {index < orderDetails.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" px={2}>
                <Typography variant="subtitle1" fontWeight="600">Total</Typography>
                <Typography variant="subtitle1" fontWeight="700" color="primary.main">
                  {formatCurrency(orderDetails.totalAmount)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                <ShippingIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Shipping Address
              </Typography>
              <Typography color="text.secondary" sx={{ px: 1 }}>
                {orderDetails.shippingAddress}
              </Typography>
              
              <Box mt={3} pt={2} borderTop={`1px dashed ${theme.palette.divider}`}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Estimated Delivery</Typography>
                <Typography variant="body1" fontWeight="500">
                  {(() => {
                    const orderDate = new Date(orderDetails.orderDate);
                    const deliveryDate = new Date(orderDate);
                    deliveryDate.setDate(deliveryDate.getDate() + 4);
                    
                    return deliveryDate.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    });
                  })()}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box 
            display="flex" 
            justifyContent="center" 
            gap={3} 
            mt={4}
            sx={{
              '& button': {
                borderRadius: '28px',
                px: 4,
                py: 1.2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }
            }}
          >
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
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
        
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            If you have any questions about your order, please contact our support team.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default OrderConfirmation;