//addProducts.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { green } from "@mui/material/colors";

export default function AddProduct() {
  const getData = async (e) => {
    e.preventDefault();
    let cityArray = city.split(",");
    const data = { productName, price, category, stock, description, cityArray };
    console.log(cityArray);
    if (
      !data.productName ||
      !data.price ||
      !data.category ||
      !data.stock ||
      !data.description ||
      !data.cityArray
    ) {
      alert("Please fill in all required fields");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8080/item/add",
          data,
          {
            withCredentials: true, // Important for cookies
          }
        );
        alert("Product added successfully");
        //       navigate("/products");
        console.log("bapa sita ramx");
      } catch (error) {
        console.error("There was an error adding the product!", error);
        alert("Failed to add product");
      }
    }
  };

  const [productName, setproductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add Products Here
        </Typography>
        <form onSubmit={getData}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setproductName(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              Lable="Stock"
              required
            />
          </Box>
          {/* Role Dropdown */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mb: 2, backgroundColor: green[600] }}
          >
            Add
          </Button>
        </form>
      </Paper>
    </Container>
  );
}