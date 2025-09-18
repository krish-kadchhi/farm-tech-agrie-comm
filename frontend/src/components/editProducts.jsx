import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import axios from 'axios';
import { toast } from 'sonner';
import { API_ENDPOINTS } from "../config/api";

// TabPanel component for different sections
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    image: '',
    city: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/item/all-products', { withCredentials: true });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      stock: product.stock,
      image: product.image,
      city: product.city || []
    });
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCityChange = (event) => {
    setEditForm(prev => ({
      ...prev,
      city: typeof event.target.value === 'string' 
        ? event.target.value.split(',') 
        : event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/item/edit/${selectedProduct._id}`, editForm, { withCredentials: true });
      setOpenDialog(false);
      fetchProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  const renderProductGrid = (category) => {
    const filteredProducts = products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );

    return (
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Paper
              elevation={3}
              sx={{
                height: '100%',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mt: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    variant="contained"
                    onClick={() => handleEditClick(product)}
                    sx={{
                      bgcolor: '#66bb6a',
                      '&:hover': {
                        bgcolor: '#388e3c',
                      },
                    }}
                  >
                    Edit Product
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            background: "linear-gradient(45deg, #81c784 30%, #388e3c 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Edit Products
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#66bb6a',
                '&.Mui-selected': {
                  color: '#388e3c',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#388e3c',
              }
            }}
          >
            <Tab label="Fruits" />
            <Tab label="Vegetables" />
            <Tab label="Grains" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {renderProductGrid('fruit')}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderProductGrid('vegetable')}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderProductGrid('grain')}
        </TabPanel>

        {/* Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Product Name"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={editForm.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="fruit">Fruit</MenuItem>
                  <MenuItem value="vegetable">Vegetable</MenuItem>
                  <MenuItem value="grain">Grain</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={editForm.stock}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Image URL"
                name="image"
                value={editForm.image}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Cities</InputLabel>
                <Select
                  multiple
                  value={editForm.city}
                  onChange={handleCityChange}
                  label="Cities"
                >
                  {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'].map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{
                bgcolor: '#66bb6a',
                '&:hover': {
                  bgcolor: '#388e3c',
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default EditProducts;