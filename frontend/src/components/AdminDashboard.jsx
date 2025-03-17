// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Grid, Paper, Typography, Box, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, TextField, 
  MenuItem, Select, FormControl, InputLabel,
  Card, CardContent, Tabs, Tab
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [productDemand, setProductDemand] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Fetch all orders
    fetchOrders();
    // Fetch all users
    fetchUsers();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      calculateOrderStatusStats();
      calculateRevenueData();
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders/all');
      
      if (!response.data || !response.data.success || !Array.isArray(response.data.orders)) {
        console.error("Invalid response format:", response.data);
        setOrders([]);
        return;
      }
  
      console.log("Fetched orders:", response.data.orders);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };
  

  const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:8080/auth/allusers');
        
        if (response.data && response.data.success && Array.isArray(response.data.users)) {
            setUsers(response.data.users);
        } else {
            console.error('Invalid user data structure:', response.data);
            setUsers([]); // Fallback to empty array
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
    }
};


const handleUserChange = async (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);
  
    try {
      const response = await axios.get(`http://localhost:8080/orders/user/${userId}`);
      
      if (response.data && Array.isArray(response.data.orders)) {
        setUserOrders(response.data.orders);
      } else {
        console.error('Unexpected response format:', response.data);
        setUserOrders([]); // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setUserOrders([]); // Handle errors gracefully
    }
  };
  

  // First, ensure calculateProductDemand runs when orders change
useEffect(() => {
    calculateProductDemand();
  }, [orders]); // Add this useEffect to run calculation whenever orders change
  
  const calculateProductDemand = () => {
    if (!orders || orders.length === 0) {
      console.warn("No orders found for product demand calculation.");
      setProductDemand([]);
      return;
    }
    
    // Add debugging to understand your data structure
    console.log("First order sample:", orders[0]);
    
    const productCounts = {};
    
    orders.forEach(order => {
      // Check if items exists and is an array
      if (!order.items || !Array.isArray(order.items)) {
        console.warn("Order items are not an array:", order);
        return;
      }
      
      order.items.forEach(item => {
        // Check the actual structure of your item object
        console.log("Item structure:", item);
        
        // Try different property names that might contain the product name
        const productId = item.item || item.productId || item.product || item.name || item._id;
        
        if (!productId) {
          console.warn("Cannot identify product in item:", item);
          return;
        }
        
        const quantity = item.quantity || 1;
        productCounts[productId] = (productCounts[productId] || 0) + quantity;
      });
    });
    
    const sortedProducts = Object.entries(productCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count);
    
    console.log("Calculated product demand:", sortedProducts);
    setProductDemand(sortedProducts);
  };
  

  const calculateOrderStatusStats = () => {
    const statusCounts = {
      'Pending': 0,
      'Processing': 0,
      'Shipped': 0,
      'Delivered': 0
    };

    orders.forEach(order => {
      statusCounts[order.orderStatus]++;
    });

    setOrderStatusStats(statusCounts);
  };

  const calculateRevenueData = () => {
    // Group orders by date and calculate total revenue
    const revenueByDate = {};
    
    orders.forEach(order => {
      const date = new Date(order.orderDate).toLocaleDateString();
      if (revenueByDate[date]) {
        revenueByDate[date] += order.totalAmount;
      } else {
        revenueByDate[date] = order.totalAmount;
      }
    });

    setRevenueData(revenueByDate);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { orderStatus: newStatus });
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Prepare chart data
  const productDemandChartData = {
    labels: productDemand.slice(0, 10).map(item => item.product),
    datasets: [
      {
        label: 'Quantity Ordered',
        data: productDemand.slice(0, 10).map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const orderStatusChartData = {
    labels: Object.keys(orderStatusStats),
    datasets: [
      {
        label: 'Order Count',
        data: Object.values(orderStatusStats),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  const revenueChartData = {
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(revenueData),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Orders" />
          <Tab label="User Orders" />
          <Tab label="Product Demand" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{orders.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{users.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Pending Orders</Typography>
              <Typography variant="h4">{orderStatusStats['Pending'] || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Revenue Over Time</Typography>
              <Line data={revenueChartData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Order Status</Typography>
              <Pie data={orderStatusChartData} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Top Products</Typography>
              <Bar data={productDemandChartData} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Orders Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            All Orders
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* User Orders Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Orders
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Select User</InputLabel>
              <Select
                labelId="user-select-label"
                value={selectedUser}
                onChange={handleUserChange}
                label="Select User"
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name || user.email || user._id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {selectedUser && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {Array.isArray(userOrders) && userOrders.map((order) => (
  <TableRow key={order._id}>
    <TableCell>{order.orderId}</TableCell>
    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
    <TableCell>{order.orderStatus}</TableCell>
    <TableCell>
      <Button size="small" onClick={() => console.log('Order items:', order.items)}>
        View Items
      </Button>
    </TableCell>
  </TableRow>
))}

                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Product Demand Tab */}
      {/* Product Demand Tab */}
{tabValue === 3 && (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Product Demand
    </Typography>
    {productDemand.length > 0 ? (
      <ul>
        {productDemand.map((item, index) => (
          <li key={index}>
            {item.product}: {item.count} units
          </li>
        ))}
      </ul>
    ) : (
      <Typography>No product demand data available</Typography>
    )}
  </Paper>
)}

    </Container>
  );
}

export default AdminDashboard;