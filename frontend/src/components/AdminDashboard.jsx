// AdminDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Skeleton,
  useTheme,
  alpha,
  Dialog,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Person as UserIcon,
  Inventory as ProductIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
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
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import API_BASE_URL from "../config/api";

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
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [productDemand, setProductDemand] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [revenueFilter, setRevenueFilter] = useState("total"); // 'total' or 'monthly'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [openItemsDialog, setOpenItemsDialog] = useState(false);

  useEffect(() => {
    // Fetch all orders and users
    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      calculateOrderStatusStats();
      calculateRevenueData();
      calculateProductDemand();
    }
  }, [orders]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchOrders(), fetchUsers()]);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate filtered revenue
  const calculateFilteredRevenue = () => {
    if (revenueFilter === "total") {
      return orders
        .reduce((sum, order) => sum + order.totalAmount, 0)
        .toFixed(2);
    } else {
      return orders
        .filter((order) => {
          const orderDate = new Date(order.orderDate);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, order) => sum + order.totalAmount, 0)
        .toFixed(2);
    }
  };
  // Month names array for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/all`, { withCredentials: true });

      if (
        !response.data ||
        !response.data.success ||
        !Array.isArray(response.data.orders)
      ) {
        console.error("Invalid response format:", response.data);
        setOrders([]);
        return;
      }

      console.log("Fetched orders:", response.data.orders);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/allusers`, { withCredentials: true });

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.users)
      ) {
        setUsers(response.data.users);
      } else {
        console.error("Invalid user data structure:", response.data);
        setUsers([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      throw error;
    }
  };

  const handleUserChange = async (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/user/${userId}`,
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data.orders)) {
        setUserOrders(response.data.orders);
      } else {
        console.error("Unexpected response format:", response.data);
        setUserOrders([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setUserOrders([]); // Handle errors gracefully
    }
  };

  const handleOpenItemsDialog = (items) => {
    setSelectedOrderItems(items);
    setOpenItemsDialog(true);
  };

  const handleCloseItemsDialog = () => {
    setOpenItemsDialog(false);
  };

  const calculateProductDemand = () => {
    if (!orders || orders.length === 0) {
      console.warn("No orders found for product demand calculation.");
      setProductDemand([]);
      return;
    }

    // Add debugging to understand your data structure
    console.log("First order sample:", orders[0]);

    const productCounts = {};

    orders.forEach((order) => {
      // Check if items exists and is an array
      if (!order.items || !Array.isArray(order.items)) {
        console.warn("Order items are not an array:", order);
        return;
      }

      order.items.forEach((item) => {
        // Check the actual structure of your item object
        console.log("Item structure:", item);

        // Try different property names that might contain the product name
        const productId =
          item.item || item.productId || item.product || item.name || item._id;

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
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
    };

    orders.forEach((order) => {
      statusCounts[order.orderStatus]++;
    });

    setOrderStatusStats(statusCounts);
  };

  const calculateRevenueData = () => {
    // Group orders by date and calculate total revenue
    const revenueByDate = {};

    orders.forEach((order) => {
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
      console.error("Error updating order status:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return theme.palette.warning.main;
      case "Processing":
        return theme.palette.info.main;
      case "Shipped":
        return theme.palette.primary.main;
      case "Delivered":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Prepare chart data with improved styling
  const productDemandChartData = {
    labels: productDemand.slice(0, 10).map((item) => item.product),
    datasets: [
      {
        label: "Quantity Ordered",
        data: productDemand.slice(0, 10).map((item) => item.count),
        backgroundColor: [
          alpha(theme.palette.primary.main, 0.7),
          alpha(theme.palette.secondary.main, 0.7),
          alpha(theme.palette.success.main, 0.7),
          alpha(theme.palette.warning.main, 0.7),
          alpha(theme.palette.info.main, 0.7),
          alpha(theme.palette.primary.light, 0.7),
          alpha(theme.palette.secondary.light, 0.7),
          alpha(theme.palette.success.light, 0.7),
          alpha(theme.palette.warning.light, 0.7),
          alpha(theme.palette.info.light, 0.7),
        ],
        borderWidth: 1,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const orderStatusChartData = {
    labels: Object.keys(orderStatusStats),
    datasets: [
      {
        label: "Order Count",
        data: Object.values(orderStatusStats),
        backgroundColor: [
          alpha(theme.palette.warning.main, 0.7),
          alpha(theme.palette.info.main, 0.7),
          alpha(theme.palette.primary.main, 0.7),
          alpha(theme.palette.success.main, 0.7),
        ],
        borderWidth: 1,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const revenueChartData = {
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(revenueData),
        fill: true,
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        borderColor: theme.palette.success.main,
        tension: 0.3,
        pointBackgroundColor: theme.palette.success.main,
        pointBorderColor: theme.palette.background.paper,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.grey[900], 0.8),
        titleFont: {
          family: theme.typography.fontFamily,
          weight: "bold",
        },
        bodyFont: {
          family: theme.typography.fontFamily,
        },
        padding: 12,
        cornerRadius: 4,
      },
    },
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, textAlign: "center", py: 10 }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <DashboardIcon
          sx={{ mr: 2, fontSize: 40, color: theme.palette.primary.main }}
        />
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary"
        >
          Admin Dashboard
        </Typography>
      </Box>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 4,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          boxShadow: 1,
          px: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<DashboardIcon />} label="Overview" iconPosition="start" />
          <Tab icon={<OrdersIcon />} label="Orders" iconPosition="start" />
          <Tab icon={<UserIcon />} label="User Orders" iconPosition="start" />
          <Tab
            icon={<ProductIcon />}
            label="Product Demand"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                borderLeft: `5px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {orders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <TrendingUpIcon
                  fontSize="small"
                  color="primary"
                  sx={{ verticalAlign: "text-bottom", mr: 0.5 }}
                />
                {orders.length > 0 ? "Active orders" : "No orders yet"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                borderLeft: `5px solid ${theme.palette.success.main}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  {revenueFilter === "total"
                    ? "Total Revenue"
                    : "Monthly Revenue"}
                </Typography>
                <Select
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="total">Total</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </Box>

              {revenueFilter === "monthly" && (
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Select
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    size="small"
                    sx={{ flex: 2 }}
                  >
                    {monthNames.map((month, index) => (
                      <MenuItem key={index} value={index}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    {Array.from(
                      new Set(
                        orders.map((order) =>
                          new Date(order.orderDate).getFullYear()
                        )
                      )
                    )
                      .sort()
                      .map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              )}

              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                ₹{calculateFilteredRevenue()}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <TrendingUpIcon
                  fontSize="small"
                  color="success"
                  sx={{ verticalAlign: "text-bottom", mr: 0.5 }}
                />
                {revenueFilter === "total"
                  ? "Overall earnings"
                  : `${monthNames[currentMonth]} ${currentYear}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                borderLeft: `5px solid ${theme.palette.info.main}`,
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <TrendingUpIcon
                  fontSize="small"
                  color="info"
                  sx={{ verticalAlign: "text-bottom", mr: 0.5 }}
                />
                Registered accounts
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                borderLeft: `5px solid ${theme.palette.warning.main}`,
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Pending Orders
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {orderStatusStats["Pending"] || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <TrendingUpIcon
                  fontSize="small"
                  color="warning"
                  sx={{ verticalAlign: "text-bottom", mr: 0.5 }}
                />
                Require attention
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Revenue Over Time
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 320 }}>
                <Line data={revenueChartData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Order Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  height: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pie data={orderStatusChartData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Top Products
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 320 }}>
                <Bar data={productDemandChartData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Orders Tab */}
      {tabValue === 1 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            All Orders
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Order Date</TableCell>
                  {/* <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order._id}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    {/* <TableCell>
                      <Chip 
                        label={order.orderStatus} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(getStatusColor(order.orderStatus), 0.1),
                          color: getStatusColor(order.orderStatus),
                          fontWeight: 'medium'
                        }} 
                      />
                    </TableCell> */}
                    {/* <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            sx={{ 
                              bgcolor: alpha(theme.palette.background.paper, 0.9),
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                              }
                            }}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* User Orders Tab */}
      {tabValue === 2 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            User Orders
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Select User</InputLabel>
              <Select
                labelId="user-select-label"
                value={selectedUser}
                onChange={handleUserChange}
                label="Select User"
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.8),
                        }}
                      >
                        {(user.name && user.name[0]) ||
                          (user.email && user.email[0]) ||
                          "U"}
                      </Avatar>
                      {user.name || user.email || user._id}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedUser && (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Order Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Items</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(userOrders) &&
                    userOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        sx={{
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.orderStatus}
                            size="small"
                            sx={{
                              bgcolor: alpha(
                                getStatusColor(order.orderStatus),
                                0.1
                              ),
                              color: getStatusColor(order.orderStatus),
                              fontWeight: "medium",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenItemsDialog(order.items)}
                          >
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
      {tabValue === 3 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Product Demand Analysis
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {productDemand.length > 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 400 }}>
                  <Bar data={productDemandChartData} options={chartOptions} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="medium"
                >
                  Detailed Product Demand
                </Typography>
                <TableContainer sx={{ maxHeight: 350, overflowY: "auto" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Units Sold
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          % of Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productDemand.map((item, index) => {
                        const totalDemand = productDemand.reduce(
                          (sum, i) => sum + i.count,
                          0
                        );
                        const percentage = (
                          (item.count / totalDemand) *
                          100
                        ).toFixed(1);

                        return (
                          <TableRow
                            key={index}
                            sx={{
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                              },
                              transition: "background-color 0.2s",
                            }}
                          >
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: `${percentage}%`,
                                    height: 8,
                                    maxWidth: "100%",
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.7
                                    ),
                                    borderRadius: 1,
                                    mr: 1,
                                  }}
                                />
                                {percentage}%
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <ProductIcon
                sx={{
                  fontSize: 60,
                  color: alpha(theme.palette.text.secondary, 0.5),
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary">
                No product demand data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data will appear once orders are placed
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Items Dialog */}
      <Dialog
        open={openItemsDialog}
        onClose={handleCloseItemsDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Order Items
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {selectedOrderItems.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrderItems.map((item, index) => (
                    <TableRow key={item._id || index}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", py: 2 }}>
              No items available for this order.
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" onClick={handleCloseItemsDialog}>
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

export default AdminDashboard;
