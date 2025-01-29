import React from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Box,
} from "@mui/material";
import { green } from "@mui/material/colors";

export default function Home() {
  const services = [
    {
      title: "Direct Farm to Door",
      description:
        "Get fresh produce directly from local farmers delivered to your doorstep, ensuring maximum freshness and supporting local agriculture.",
    },
    {
      title: "Quality Assurance",
      description:
        "All products undergo strict quality checks to ensure you receive the finest fruits and vegetables that meet our high standards.",
    },
    {
      title: "Bulk Orders",
      description:
        "Special pricing and handling for bulk orders, perfect for restaurants, hotels, and large families.",
    },
    {
      title: "Seasonal Specialties",
      description:
        "Access to seasonal and exotic produce, carefully curated to bring you the best of each season.",
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box className="py-8">
        {/* Hero Section */}
        <Box className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
          <img
            src="/pexels-janetrangdoan-1132047.jpg"
            alt="Fresh fruits and vegetables"
            className="w-full h-full object-cover"
          />
          <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Box className="text-center">
              <Typography variant="h2" className="text-white mb-4">
                Welcome to Farm-Tech
              </Typography>
              <Typography variant="h5" className="text-white mb-8">
                Fresh vegetables and fruits, from farm to your table
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: green[500],
                  "&:hover": {
                    bgcolor: green[600],
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: "9999px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
                onClick={() => (window.location.href = "/products")}
              >
                Shop Now
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Services Section */}
        <Box className="mb-12">
          <Typography
            variant="h3"
            className="text-center mb-8"
            sx={{ color: green[800] }}
          >
            Our Services
          </Typography>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  className="h-full transition-shadow duration-300"
                  sx={{
                    "&:hover": {
                      boxShadow: 6,
                      borderColor: green[200],
                    },
                    border: 1,
                    borderColor: green[100],
                  }}
                >
                  <CardHeader
                    title={service.title}
                    sx={{
                      bgcolor: green[50],
                      "& .MuiCardHeader-title": {
                        color: green[800],
                        fontSize: "1.25rem",
                        fontWeight: 600,
                      },
                    }}
                  />
                  <CardContent>
                    <Typography color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Banner Section */}
        <Box className="rounded-lg p-8 text-center" sx={{ bgcolor: green[50] }}>
          <Typography variant="h4" className="mb-4" sx={{ color: green[800] }}>
            Committed to Fresh & Sustainable Farming
          </Typography>
          <Typography sx={{ color: green[700] }} className="max-w-2xl mx-auto">
            Join us in supporting local farmers while enjoying the freshest
            produce delivered right to your doorstep. Our commitment to
            sustainable agriculture ensures both quality for you and care for
            the environment.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
