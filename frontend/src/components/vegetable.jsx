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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Vegetable() {
  const [myData, setMyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredVegetables, setFilteredVegetables] = useState([]);
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCardClick = (vegetable) => {
    setSelectedVegetable({
      ...vegetable,
      nutritionalInfo: {
        calories: "23 kcal",
        protein: "1.2g",
        carbohydrates: "5.1g",
        fiber: "2.8g",
        sugar: "2.3g",
        fat: "0.1g",
        vitamins: ["Vitamin A", "Vitamin C", "Folate"],
      },
      description:
        "Fresh and organic vegetables sourced directly from trusted farmers. High-quality, pesticide-free, and rich in nutrients.",
      storage: "Keep refrigerated for freshness.",
      origin: "Local Farms, Gujarat",
      seasonality: "Available year-round",
    });
    setOpenDialog(true);
  };

  async function addToCart(vegetable, event) {
    if (event) event.stopPropagation();
    const data = {
      item: vegetable.name,
      category: vegetable.category,
      price: vegetable.price,
      image: vegetable.image,
    };
    try {
      const res = await axios.post("http://localhost:8080/cart/addCart", data, {
        withCredentials: true,
      });
      toast.success("Item added to cart");
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Error adding to cart:", err);
    }
  }
useEffect(() => {
 axios
     .get("http://localhost:8080/item/showPro", { withCredentials: true })
     .then((response) => {
       console.log("API Response:", response.data);
       if (Array.isArray(response.data) && response.data.length > 0) {
         setMyData([...response.data]); // ✅ Ensures React detects changes
       } else {
         console.error("Empty or invalid data received:", response.data);
       }
     })
     .catch((err) => {
       console.error("Error fetching products:", err);
       setError(err.message);
     })
     .finally(() => {
       setIsLoading(false);
     });
 }, []);

 // Update Filtered Grains
 useEffect(() => {
   console.log("Updating filteredVegetables myData:", myData);
   if (myData.length > 0) {
     const vegetables = myData.filter(
       (item) => item.category.toLowerCase() === "vegetable"
     ); // ✅ Fixed filtering

     let sortedVegetables = [...vegetables];
     if (sortBy === "price-low") {
       sortedVegetables.sort((a, b) => a.price - b.price);
     } else if (sortBy === "price-high") {
       sortedVegetables.sort((a, b) => b.price - a.price);
     }

     setFilteredVegetables(sortedVegetables);
     console.log("Filtered Grains:", sortedVegetables);
   }
 }, [searchQuery, sortBy, myData]); // ✅ Dependencies updated

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
                  placeholder="Search for vegetables..."
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
        {filteredVegetables.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f8f9fa" }}>
            <Typography variant="h6" color="textSecondary">
              No vegetables found matching your search
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredVegetables.map((vegetable) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={vegetable.id}>
                <Paper
                  elevation={0}
                  onClick={() => handleCardClick(vegetable)}
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
                      src={vegetable.image}
                      alt={vegetable.name}
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
                    {vegetable.name}
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
                      ₹{vegetable.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={(e) => addToCart(vegetable, e)}
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
          {selectedVegetable && (
            <>
              <DialogTitle>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h5" component="h2">
                    {selectedVegetable.name}
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
                      src={selectedVegetable.image}
                      alt={selectedVegetable.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        marginBottom: "16px",
                      }}
                    />
                    <Typography variant="h6" color="Black" gutterBottom>
                      ₹{selectedVegetable.price} per kg
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "#43a047",
                        "&:hover": { bgcolor: "#66bb6a" },
                        mt: 2,
                      }}
                      onClick={(e) => addToCart(selectedVegetable, e)}
                    >
                      Add to Cart
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Product Details
                    </Typography>
                    <Typography paragraph>
                      {selectedVegetable.description}
                    </Typography>

                    <Typography variant="h6" gutterBottom>
                      Nutritional Information
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(selectedVegetable.nutritionalInfo).map(
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
                        )}
                      </TableBody>
                    </Table>

                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Key Vitamins:{" "}
                      {selectedVegetable.nutritionalInfo.vitamins.join(", ")}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Storage:</strong> {selectedVegetable.storage}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Origin:</strong> {selectedVegetable.origin}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Seasonality:</strong>{" "}
                      {selectedVegetable.seasonality}
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
