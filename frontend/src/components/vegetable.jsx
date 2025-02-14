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
      description: "Fresh and organic vegetables sourced directly from trusted farmers. High-quality, pesticide-free, and rich in nutrients.",
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
      const res = await axios.post("http://localhost:8080/cart/addCart", data, { withCredentials: true });
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
        setFilteredVegetables(response.data.filter(item => item.category === "vegetable" && item.stock > 0));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Fresh Vegetables</Typography>
      <Grid container spacing={3}>
        {filteredVegetables.map((vegetable) => (
          <Grid item xs={12} sm={6} md={4} key={vegetable.id}>
            <Paper onClick={() => handleCardClick(vegetable)}>
              <img src={vegetable.image} alt={vegetable.name} style={{ width: '100%', height: '200px' }} />
              <Typography>{vegetable.name}</Typography>
              <Typography>₹{vegetable.price} per kg</Typography>
              <Button onClick={(e) => addToCart(vegetable, e)}>Add to Cart</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedVegetable && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5">{selectedVegetable.name}</Typography>
                <IconButton onClick={() => setOpenDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <img src={selectedVegetable.image} alt={selectedVegetable.name} style={{ width: '100%' }} />
              <Typography>{selectedVegetable.description}</Typography>
              <Typography>Storage: {selectedVegetable.storage}</Typography>
              <Typography>Origin: {selectedVegetable.origin}</Typography>
              <Typography>Seasonality: {selectedVegetable.seasonality}</Typography>
              <Table>
                <TableBody>
                  {Object.entries(selectedVegetable.nutritionalInfo).map(([key, value]) => (
                    key !== 'vitamins' && (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
              <Typography>Key Vitamins: {selectedVegetable.nutritionalInfo.vitamins.join(", ")}</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
