// FarmerProductDemand.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Grid, Paper, Typography, Box, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert,
  useTheme, alpha
} from '@mui/material';
import {
  Inventory as ProductIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import API_BASE_URL from "../config/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FarmerProductDemand() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [productDemand, setProductDemand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      calculateProductDemand();
    }
  }, [orders]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/all`, { withCredentials: true });
      
      if (!response.data || !response.data.success || !Array.isArray(response.data.orders)) {
        console.error("Invalid response format:", response.data);
        setOrders([]);
        return;
      }
  
      console.log("Fetched orders:", response.data.orders);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError("Failed to load order data. Please try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
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

  // Prepare chart data with improved styling
  const productDemandChartData = {
    labels: productDemand.slice(0, 10).map(item => item.product),
    datasets: [
      {
        label: 'Quantity Sold',
        data: productDemand.slice(0, 10).map(item => item.count),
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
          weight: 'bold',
        },
        bodyFont: {
          family: theme.typography.fontFamily,
        },
        padding: 12,
        cornerRadius: 4,
      },
      title: {
        display: true,
        text: 'Top 10 Products in Demand',
        font: {
          family: theme.typography.fontFamily,
          size: 16,
          weight: 'bold',
        }
      }
    },
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center', py: 10 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading product demand data...
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
        <Button variant="contained" onClick={fetchOrders}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ProductIcon sx={{ mr: 2, fontSize: 40, color: theme.palette.primary.main }} />
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Product Demand Analysis
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Product Demand Analysis
        </Typography>
        
        {productDemand.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 400 }}>
                <Bar data={productDemandChartData} options={chartOptions} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Detailed Product Demand
              </Typography>
              <TableContainer sx={{ maxHeight: 350, overflowY: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Units Sold</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productDemand.map((item, index) => {
                      const totalDemand = productDemand.reduce((sum, i) => sum + i.count, 0);
                      const percentage = ((item.count / totalDemand) * 100).toFixed(1);
                      
                      return (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: `${percentage}%`,
                                  height: 8,
                                  maxWidth: '100%',
                                  bgcolor: alpha(theme.palette.primary.main, 0.7),
                                  borderRadius: 1,
                                  mr: 1
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
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <ProductIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.5), mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No product demand data available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data will appear once orders are placed for your products
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default FarmerProductDemand;