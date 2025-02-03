import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { green } from "@mui/material/colors";
export default function Grain() {
  const [myData, setMyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function addToCart(grain) {
    const data = {
      item: grain.name,
      category: grain.category,
      price: grain.price,
      //   image: fruit.image,
    };

    try {
      await axios.post("http://localhost:8080/cart/addCart", data, {
        withCredentials: true, // For sending cookies
      });
      console.log("Item added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/item/showPro")
      .then((response) => {
        setMyData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );

  const grains = myData.filter((item) => item.category === "grain");

  return (
    <Container>
      {/* <Search /> */}
      <Typography variant="h4" component="h2" gutterBottom>
        Fruits List
      </Typography>
      {grains.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No vegetables found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {grains.map((grain) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={grain.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  // image={`http://localhost:8080/images/${fruit.image
                  //   .split("\\")
                  //   .pop()}`}
                  alt={grain.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {grain.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {grain.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${grain.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: green[400] }}
                    onClick={() => addToCart(grain)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}