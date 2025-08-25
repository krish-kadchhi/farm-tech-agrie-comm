import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
} from "@mui/material";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Fetch search results from the backend
  const fetchResults = async (searchQuery) => {
   try {
     const response = await axios.get(
       `https://farm-tech-agrie-comm.onrender.com/item/searchProduct?query=${searchQuery}`
     );

     // Filter for "fruit" category (case-insensitive)
     const filteredResults = response.data.filter(
       (product) => product.category?.toLowerCase() === "fruit"
     );

     setResults(filteredResults);
   } catch (error) {
     console.error("Error fetching search results:", error);
   }
  };
  const addToCart = async (product) => {
    const data = {
      item: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    };

    try {
      await axios.post("https://farm-tech-agrie-comm.onrender.com/cart/addCart", data, {
        withCredentials: true, // For sending cookies
      });
      console.log("Item added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
  // Debounced version of fetchResults
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchResults(searchQuery), 500),
    []
  );

  // Trigger debouncedFetchResults whenever the query changes
  useEffect(() => {
    if (query.trim() !== "") {
      debouncedFetchResults(query);
    } else {
      setResults([]);
    }
  }, [query, debouncedFetchResults]);

  // Product Card Component
  const ProductCard = ({ product }) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          maxWidth: 345,
          m: 2,
          boxShadow: 3,
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.image || "/placeholder-image.jpg"}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />

        <CardContent sx={{ textAlign: "left" }}>
          <Typography variant="caption" color="text.secondary">
            {product.category}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="h6" color="text.primary">
            ${product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          {/* <Typography variant="body2" sx={{ mt: 1 }}>
            In Stock: {product.stockQuantity}
          </Typography> */}
        </CardContent>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#2e7d32",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
          onClick={()=>addToCart(product)}
        >
          ADD TO CART
        </Button>
      </Card>
    </Grid>
  );

  return (
    <div style={{ padding: "20px" }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={2}>
        {results.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Grid>
    </div>
  );
};

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export default SearchComponent;