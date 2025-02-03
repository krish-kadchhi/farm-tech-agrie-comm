import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Snackbar,
} from "@mui/material";

export default function ProductShow() {
  const [myData, setData] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();

  const addInCart = async (item) => {
    try {
      const data = {
        item: item.name,  // Update key to "item"
        category: item.category,  // Update key to "category"
        price: item.price,  // Update key to "price"
        image: item.image || "", // Ensure image field exists
        quantity: 1,
      };
      await axios.post("http://localhost:8080/cart/addCart", data);
      setCartMessage(`${item.name} added to cart`);
    } catch (error) {
      setCartMessage("Failed to add item to cart");
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("loginCookie");
      if (!token) {
        navigate("/signup");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/item/showPro", {
          withCredentials: true, // Ensures cookies/session are sent
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    

    checkAuth();
    fetchProducts();
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        All Products
      </Typography>

      <Grid container spacing={4}>
        {/* Category Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="Fruits"
              height="240"
              image="/public/pexels-janetrangdoan-1132047.jpg"
              sx={{
                objectFit: "cover",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                },
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fruits
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fresh, organic fruits picked from local farms.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                href="/fruit"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="Vegetables"
              height="240"
              image="/public/front-view-vegetable.jpg"
              sx={{
                objectFit: "cover",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                },
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vegetables
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Handpicked seasonal vegetables for your meals.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                href="/vegetable"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="Grains"
              height="240"
              image="/public/alex-block-ADDSk5wigwI-unsplash.jpg"
              sx={{
                objectFit: "cover",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                },
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Grains
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pure, nutritious grains sourced from the best farms.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                href="/grain"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Dynamic Product Rendering */}
        {/* {myData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={item.name}
                height="240"
                image={item.image || "/default-product.jpg"}
                sx={{
                  objectFit: "cover",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s ease",
                  },
                }}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.category}
                </Typography>
                <Typography variant="body1" color="primary">
                  ${item.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => addInCart(item)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))} */}
      </Grid>

      <Snackbar
        open={!!cartMessage}
        autoHideDuration={3000}
        onClose={() => setCartMessage("")}
        message={cartMessage}
      />
    </Container>
  );
}
