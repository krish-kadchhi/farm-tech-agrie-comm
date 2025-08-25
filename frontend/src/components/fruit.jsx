import { useEffect, useState } from "react";
import axios from "axios";
 
import { toast } from "sonner";
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
  FormHelperText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function Fruit() {
  const [myData, setMyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [userAddress, setUserAddress] = useState("");
  
  // List of Gujarat districts
  const gujaratDistricts = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", 
    "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", 
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", 
    "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", 
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
    "Tapi", "Vadodara", "Valsad"
  ];

  const handleCardClick = (fruit) => {
    setSelectedFruit({
      ...fruit,
  
      description:
        fruit.description ||"Fresh and delicious fruit, handpicked from the best orchards. Our fruits are naturally ripened and carefully selected to ensure the highest quality.",
      
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
      const res = await axios.post("https://farm-tech-agrie-comm.onrender.com/cart/addCart", data, {
        withCredentials: true,
      });
      toast.success("Item added to cart");
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Error adding to cart:", err);
    }
  }
  useEffect(() => {
      setUserAddress("");
    }, []);

  // Function to fetch products based on location
  const fetchProducts = async (location = null) => {
    setIsLoading(true);
    try {
      let url = "https://farm-tech-agrie-comm.onrender.com/item/showPro";
      
      // If location is provided, add it as query parameter
      if (location) {
        url = `https://farm-tech-agrie-comm.onrender.com/item/showPro?district=${location}`;
      }
      
      const response = await axios.get(url, { withCredentials: true });
      console.log("API Response:", response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setMyData([...response.data]);
      } else {
        console.error("Empty or invalid data received:", response.data);
        setMyData([]); // Set empty array to handle no products case
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle district selection change
  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    
    if (district) {
      fetchProducts(district);
    } else {
      // If no district selected, fetch products based on user's address
      fetchProducts();
    }
  };

  useEffect(() => {
    // Initial fetch user address and products
    // fetchUserAddress();
    fetchProducts();
  }, []);

  // Update Filtered Fruits
  useEffect(() => {
    console.log("Updating filteredFruits myData:", myData);
    if (myData.length > 0) {
      // Filter for fruits category
      let fruits = myData.filter(
        (item) => item.category.toLowerCase() === "fruit"
      );
      
      // Apply search query filter if any
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        fruits = fruits.filter(
          (fruit) => fruit.name.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      let sortedFruits = [...fruits];
      if (sortBy === "price-low") {
        sortedFruits.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        sortedFruits.sort((a, b) => b.price - a.price);
      }

      setFilteredFruits(sortedFruits);
      console.log("Filtered Fruits:", sortedFruits);
    } else {
      setFilteredFruits([]);
    }
  }, [searchQuery, sortBy, myData]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
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
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Location Selection Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "#f5f9ff",
            borderRadius: 2,
            border: "1px solid #e0e7ff",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ color: "primary.main", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={500}>
                  {selectedDistrict 
                    ? `Showing products available in ${selectedDistrict}` 
                    : userAddress 
                      ? `Showing products available in ${userAddress}` 
                      : "Select a location to see available products"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>My Location</em>
                  </MenuItem>
                  {gujaratDistricts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select district or use your default location
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Enhanced Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search for fruits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  }
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon sx={{ color: "text.secondary" }} />
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
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f8f9fa" }}>
            <Typography variant="h6" color="textSecondary">
              {isLoading ? "Loading products..." : "No fruits found matching your criteria"}
            </Typography>
            {!isLoading && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {selectedDistrict ? 
                  `Try selecting a different district or check back later.` : 
                  `Try selecting a specific district from the dropdown.`}
              </Typography>
            )}
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
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 1,
                        display: "flex",
                        gap: 0.5,
                      }}
                    >
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                        label="30 min"
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                    <img
                      src={fruit.image}
                      alt={fruit.name}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "contain",
                        marginBottom: "16px",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {fruit.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                    }}
                  >
                    1 Kg
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
                      Free Delivery
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: "auto",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ₹{fruit.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={(e) => addToCart(fruit, e)}
                      sx={{
                        bgcolor: "#43a047",
                        "&:hover": {
                          bgcolor: "#66bb6a",
                        },
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
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
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        marginBottom: "16px",
                      }}
                    />
                    <Typography variant="h6" color="Black" gutterBottom>
                      ₹{selectedFruit.price} per kg
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "#43a047",
                        "&:hover": { bgcolor: "#66bb6a" },
                        mt: 2,
                      }}
                      onClick={(e) => addToCart(selectedFruit, e)}
                    >
                      Add to Cart
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Product Details
                    </Typography>
                    <Typography paragraph>
                      {selectedFruit.description}
                    </Typography>

                    <Table size="small">
                      <TableBody>
                        {/* {Object.entries(selectedFruit.nutritionalInfo).map(
                          ([key, value]) =>
                            key !== "vitamins" && (
                              <TableRow key={key}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ border: "none", pl: 0 }}
                                >
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ border: "none" }}
                                >
                                  {value}
                                </TableCell>
                              </TableRow>
                            )
                        )} */}
                      </TableBody>
                    </Table>

                   
                    <Divider sx={{ my: 2 }} />

                    {/* <Typography variant="subtitle1" gutterBottom>
                      <strong>Storage:</strong> {selectedFruit.storage}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Origin:</strong> {selectedFruit.origin}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Seasonality:</strong> {selectedFruit.seasonality}
                    </Typography> */}
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

export default Fruit;