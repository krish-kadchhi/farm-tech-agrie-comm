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
  Stack,
  Divider,
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

  const stats = [
    { number: "10k+", label: "Happy Customers" },
    { number: "500+", label: "Local Farmers" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24h", label: "Delivery Time" },
  ];

  return (
    <Container>
      <Box sx={{ mx: { xs: 0.1, sm: 0.15, md: 1.0 }, py: { xs: 2, md: 4 }, mb: 2 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 4 }}>
          <Grid 
            container 
            spacing={{ xs: 2, md: 4 }} 
            sx={{ 
              minHeight: { xs: "auto", md: "70vh" },
              mb: { xs: 6, md: 12 }
            }}
          >
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: { xs: 2, md: 2 },
                  bgcolor: green[500],
                  borderRadius: 2
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: "white",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                    mb: 3
                  }}
                >
                  Welcome to Farm-Tech
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    mb: 4,
                    fontSize: { xs: "1rem", sm: "1.25rem" }
                  }}
                >
                  We connect local farmers directly with consumers, ensuring that you receive 
                  the freshest vegetables and fruits straight from the farm to your table. 
                  Our mission is to promote sustainable farming and support local farmers while 
                  providing high-quality produce at affordable prices.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: green[700],
                    "&:hover": { bgcolor: green[500] },
                    px: { xs: 3, md: 6 },
                    py: 1.5,
                    borderRadius: "50px",
                    textTransform: "none",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    alignSelf: "flex-start"
                  }}
                  onClick={() => (window.location.href = "/products")}
                >
                  Shop Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "100%" },
                  backgroundImage: "url('/farmtech.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    textAlign: "center",
                    p: 2,
                    bgcolor: green[50],
                    border: 1,
                    borderColor: green[100]
                  }}
                >
                  <Typography variant="h3" sx={{ color: green[800], mb: 1 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Services Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: green[800],
              mb: { xs: 4, md: 6 },
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Our Services
          </Typography>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      borderColor: green[200],
                    },
                    border: 2,
                    borderColor: green[100],
                  }}
                >
                  <CardHeader
                    title={service.title}
                    sx={{
                      bgcolor: green[50],
                      "& .MuiCardHeader-title": {
                        color: green[800],
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                        fontWeight: 600,
                      },
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Us Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: green[800],
              mb: { xs: 4, md: 6 },
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Why Choose Farm-Tech?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="h6" color={green[800]}>
                  🌿 Sustainable Practices
                </Typography>
                <Typography>
                  We work exclusively with farmers who follow sustainable and environmentally 
                  friendly farming practices, ensuring a better future for our planet.
                </Typography>
                <Typography variant="h6" color={green[800]}>
                  🚚 Same Day Delivery
                </Typography>
                <Typography>
                  Order before noon and receive your fresh produce the same day, 
                  maintaining maximum freshness and quality.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="h6" color={green[800]}>
                  💰 Fair Pricing
                </Typography>
                <Typography>
                  By eliminating middlemen, we ensure farmers get better prices while 
                  keeping costs reasonable for consumers.
                </Typography>
                <Typography variant="h6" color={green[800]}>
                  🤝 Community Support
                </Typography>
                <Typography>
                  Every purchase supports local farming communities and helps preserve 
                  traditional farming methods.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Banner Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              bgcolor: green[50],
              borderRadius: 2,
              p: { xs: 3, md: 6 },
              textAlign: "center",
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: green[800],
                mb: 2,
                fontSize: { xs: "1.5rem", md: "2rem" }
              }}
            >
              Committed to Fresh & Sustainable Farming
            </Typography>
            <Typography 
              sx={{ 
                color: green[700],
                maxWidth: "800px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.1rem" }
              }}
            >
              Join us in supporting local farmers while enjoying the freshest
              produce delivered right to your doorstep. Our commitment to
              sustainable agriculture ensures both quality for you and care for
              the environment.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}