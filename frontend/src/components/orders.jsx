import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Rating,
  TextField,
  DialogActions,
  Collapse,
  IconButton
} from '@mui/material';
import {
  ShoppingBag as ShoppingIcon,
  LocalShipping as ShippingIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get('loginCookie');
        if (!token) {
          navigate('/signup');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded._id;

        const response = await axios.get(`http://localhost:8080/orders/user/${userId}`, {
          withCredentials: true
        });

        // Add mock shipping data to each order for demo purposes
        const ordersWithShippingData = response.data.orders.map(order => ({
          ...order,
          shippingTimeline: getShippingTimeline(order.orderStatus),
          estimatedDelivery: getEstimatedDelivery(order.orderDate),
          rating: order.rating || null
        }));

        setOrders(ordersWithShippingData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Helper functions for mock shipping data
  const getShippingTimeline = (status) => {
    switch (status) {
      case 'Delivered':
        return [
          { label: 'Order Placed', completed: true, date: '2 days ago' },
          { label: 'Processing', completed: true, date: '1 day ago' },
          { label: 'Shipped', completed: true, date: '1 day ago' },
          { label: 'Out for Delivery', completed: true, date: 'Today' },
          { label: 'Delivered', completed: true, date: 'Today' }
        ];
      case 'Processing':
        return [
          { label: 'Order Placed', completed: true, date: 'Today' },
          { label: 'Processing', completed: true, date: 'Today' },
          { label: 'Shipped', completed: false, date: 'Pending' },
          { label: 'Out for Delivery', completed: false, date: 'Pending' },
          { label: 'Delivered', completed: false, date: 'Pending' }
        ];
      case 'Cancelled':
        return [
          { label: 'Order Placed', completed: true, date: '3 days ago' },
          { label: 'Cancelled', completed: true, date: '2 days ago' }
        ];
      default:
        return [
          { label: 'Order Placed', completed: true, date: 'Today' },
          { label: 'Processing', completed: false, date: 'Pending' },
          { label: 'Shipped', completed: false, date: 'Pending' },
          { label: 'Out for Delivery', completed: false, date: 'Pending' },
          { label: 'Delivered', completed: false, date: 'Pending' }
        ];
    }
  };

  const getEstimatedDelivery = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleShippingDetails = (order) => {
    setSelectedOrder(order);
    setShippingDialogOpen(true);
  };

  const handleCloseShippingDialog = () => {
    setShippingDialogOpen(false);
  };

  const handleRateOrder = (order) => {
    setSelectedOrder(order);
    setRatingValue(order.rating || 0);
    setRatingComment(order.ratingComment || '');
    setRatingDialogOpen(true);
  };

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false);
  };

  const handleSubmitRating = async () => {
    try {
      // This would be an API call to save the rating
      // await axios.post(`http://localhost:8080/orders/${selectedOrder._id}/rate`, {
      //   rating: ratingValue,
      //   comment: ratingComment
      // });

      // For demo, just update the local state
      const updatedOrders = orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, rating: ratingValue, ratingComment: ratingComment } 
          : order
      );
      
      setOrders(updatedOrders);
      setRatingDialogOpen(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <ShoppingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Orders Found
          </Typography>
          <Typography color="text.secondary" paragraph>
            You haven't placed any orders yet. Start shopping to create your first order.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingIcon color="success" />
          Order History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track, manage and review your past purchases
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" />
                      {new Date(order.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order ID: <Box component="span" fontWeight="medium">{order.orderId}</Box>
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6" color="success" gutterBottom>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </Typography>
                    <Chip
                      label={order.orderStatus}
                      color= "default"
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />
                
                {/* Summary view - always visible */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </Typography>
                  <IconButton 
                    onClick={() => toggleOrderExpand(order._id)}
                    aria-expanded={expandedOrderId === order._id}
                    aria-label="show more"
                  >
                    {expandedOrderId === order._id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </Box>

                {/* Expanded view - shows when clicked */}
                <Collapse in={expandedOrderId === order._id} timeout="auto" unmountOnExit>
                  <List>
                    {order.items.map((item, index) => (
                      <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <ShoppingIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body1" fontWeight="medium">{item.item}</Typography>}
                          secondary={`Quantity: ${item.quantity}`}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Shipping Address: {order.shippingAddress}
                    </Typography>
                  </Box>
                </Collapse>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<TimelineIcon />}
                    onClick={() => handleShippingDetails(order)}
                    size="small"
                  >
                    Shipping & Delivery
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<StarIcon />}
                    onClick={() => handleRateOrder(order)}
                    size="small"
                    disabled={order.orderStatus === 'Cancelled'}
                  >
                    {order.rating ? 'View Rating' : 'Rate Purchase'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Shipping Timeline Dialog */}
      <Dialog open={shippingDialogOpen} onClose={handleCloseShippingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShippingIcon color="success" />
            Shipping Information
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Status
                </Typography>
                <Chip
                  label={selectedOrder.orderStatus}
                  color="default"
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Estimated Delivery
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon color="success" />
                  <Typography>Today</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Shipment Timeline
              </Typography>
              <Stepper orientation="vertical" sx={{ mb: 2 }}>
                {selectedOrder.shippingTimeline.map((step, index) => (
                  <Step key={index} active={step.completed}>
                    <StepLabel>
                      <Typography variant="body1">{step.label}</Typography>
                      <Typography variant="body2" color="">
                        Few minutes
                        {step.hour}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Shipping Address
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedOrder.shippingAddress}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Shipping Method
              </Typography>
              <Typography variant="body2">
                Standard Delivery (Today)
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseShippingDialog} 
            color="" 
            sx={{ backgroundColor: 'lightgreen', '&:hover': { backgroundColor: 'limegreen' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={handleCloseRatingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon color="success" />
            {selectedOrder?.rating ? 'Your Rating' : 'Rate Your Purchase Experience'}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Order #{selectedOrder.orderId}
              </Typography>
              
              <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="legend">Your Rating</Typography>
                <Rating
                  value={ratingValue}
                  onChange={(event, newValue) => {
                    setRatingValue(newValue);
                  }}
                  size="large"
                  readOnly={!!selectedOrder.rating}
                />
              </Box>
              
              <TextField
                label="Your Feedback"
                multiline
                rows={4}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                fullWidth
                margin="normal"
                color='success'
                variant="outlined"
                disabled={!!selectedOrder.rating}
                placeholder="Please share your experience with this purchase..."
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRatingDialog} color="success">Cancel</Button>
          {!selectedOrder?.rating && (
            <Button onClick={handleSubmitRating} variant="contained" color="success">
              Submit Rating
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Orders;