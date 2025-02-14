import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'sonner';
import {
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Box,
  Paper,
  InputBase,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Fruit() {
  const [myData, setMyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCardClick = (fruit) => {
    setSelectedFruit({
      ...fruit,
      nutritionalInfo: {
        calories: "52 kcal",
        protein: "0.3g",
        carbohydrates: "13.8g",
        fiber: "2.4g",
        sugar: "10.4g",
        fat: "0.2g",
        vitamins: ["Vitamin C", "Vitamin B6", "Potassium"],
      },
      description: "Fresh and delicious fruit, handpicked from the best orchards. Our fruits are naturally ripened and carefully selected to ensure the highest quality.",
      storage: "Store in a cool, dry place. Once ripe, refrigerate to extend freshness.",
      origin: "Local Farms, Maharashtra",
      seasonality: "Available year-round, best during summer months",
    });
    setOpenDialog(true);
  };

  async function addToCart(fruit, event) {
    if (event) event.stopPropagation();
    const data = {
      item: fruit.name,
      category: fruit.category,
      price: fruit.price,
      image: fruit.image,
    };

    try {
      const res = await axios.post("http://localhost:8080/cart/addCart", data, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Error adding to cart:", err);
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/item/showPro")
      .then((response) => {
        setMyData(response.data);
        setFilteredFruits(response.data.filter(item => item.category === "fruit" && item.stock > 0));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fruits = myData.filter(item => 
      item.category === "fruit" && 
      item.stock > 0 &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedFruits = [...fruits];
    if (sortBy === "price-low") {
      sortedFruits.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sortedFruits.sort((a, b) => b.price - a.price);
    }

    setFilteredFruits(sortedFruits);
  }, [searchQuery, sortBy, myData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Enhanced Search Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 4, 
            backgroundColor: '#f8f9fa',
            borderRadius: 2
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search for fruits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  }
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Product Grid */}
        {filteredFruits.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
            <Typography variant="h6" color="textSecondary">
              No fruits found matching your search
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredFruits.map((fruit) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fruit.id}>
                <Paper
                  elevation={0}
                  onClick={() => handleCardClick(fruit)}
                  sx={{
                    p: 2,
                    height: '100%',
                    border: '1px solid #f0f0f0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        zIndex: 1,
                        display: 'flex',
                        gap: 0.5
                      }}
                    >
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                        label="30 min"
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.9)',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <img
                      src={fruit.image}
                      alt={fruit.name}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'contain',
                        marginBottom: '16px'
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="h6" 
                    sx={{
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {fruit.name}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 1
                    }}
                  >
                    1 Kg
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
                      Free Delivery
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ₹{fruit.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={(e) => addToCart(fruit, e)}
                      sx={{
                        bgcolor: '#008001',
                        '&:hover': {
                          bgcolor: '#008010',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Product Detail Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedFruit && (
            <>
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" component="h2">
                    {selectedFruit.name}
                  </Typography>
                  <IconButton onClick={() => setOpenDialog(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <img
                      src={selectedFruit.image}
                      alt={selectedFruit.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}
                    />
                    <Typography variant="h6" color="primary" gutterBottom>
                      ₹{selectedFruit.price} per kg
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: '#008060',
                        '&:hover': { bgcolor: '#006048' },
                        mt: 2
                      }}
                      onClick={(e) => addToCart(selectedFruit, e)}
                    >
                      Add to Cart
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Product Details</Typography>
                    <Typography paragraph>{selectedFruit.description}</Typography>
                    
                    <Typography variant="h6" gutterBottom>Nutritional Information</Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(selectedFruit.nutritionalInfo).map(([key, value]) => (
                          key !== 'vitamins' && (
                            <TableRow key={key}>
                              <TableCell component="th" scope="row" sx={{ border: 'none', pl: 0 }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </TableCell>
                              <TableCell align="right" sx={{ border: 'none' }}>{value}</TableCell>
                            </TableRow>
                          )
                        ))}
                      </TableBody>
                    </Table>

                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Key Vitamins: {selectedFruit.nutritionalInfo.vitamins.join(", ")}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Storage:</strong> {selectedFruit.storage}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Origin:</strong> {selectedFruit.origin}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Seasonality:</strong> {selectedFruit.seasonality}
                    </Typography>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}