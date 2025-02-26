import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function ProductShow() {
  const [myData, setData] = useState([]);
  const navigate = useNavigate();

  const categories = [
    {
      title: "Fresh Fruits",
      description:
        "Fresh fruits sourced directly from local farms. Rich in vitamins and natural goodness.",
      image: "/public/pexels-janetrangdoan-1132047.jpg",
      link: "/fruit",
      color: "#66bb6a",
    },
    {
      title: "Fresh Vegetables",
      description:
        "Organic vegetables harvested daily for your healthy lifestyle. Farm-fresh and pesticide-free.",
      image: "/public/front-view-vegetable.jpg",
      link: "/vegetable",
      color: "#66bb6a",
    },
    {
      title: "Organic Grains",
      description:
        "Premium quality grains from certified organic farms. Nutritious and naturally processed.",
      image: "/public/alex-block-ADDSk5wigwI-unsplash.jpg",
      link: "/grain",
      color: "#66bb6a",
    },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("loginCookie");
      if (!token) {
        navigate("/signup");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/item/showPro", {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };

    checkAuth();
    fetchProducts();
  }, [navigate]);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: "linear-gradient(45deg, #81c784 30%, #388e3c 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fresh & Healthy
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            Discover premium quality fruits, vegetables, and grains delivered
            right to your doorstep
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => navigate(category.link)}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={category.image}
                    alt={category.title}
                    sx={{ objectFit: "cover" }}
                  />
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: category.color,
                    }}
                  >
                    {category.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {category.description}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LocalShippingOutlinedIcon
                        sx={{ color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Free Delivery
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(category.link);
                      }}
                      sx={{
                        bgcolor: category.color,
                        "&:hover": {
                          bgcolor: category.color,
                          filter: "brightness(0.9)",
                        },
                      }}
                    >
                      Shop Now
                    </Button>
                  </Box>
                </CardContent>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
