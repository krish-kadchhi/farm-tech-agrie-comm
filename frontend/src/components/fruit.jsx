import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'sonner';
import SearchComponent from "./searchComponent";
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
export default function Fruit() {
  const [myData, setMyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function addToCart(fruit) {
    const data = {
      item: fruit.name,
      category: fruit.category,
      price: fruit.price,
      image: fruit.image,
    };

    try {
      const res = await axios.post("http://localhost:8080/cart/addCart", data, {
        withCredentials: true, // For sending cookies
      });
      toast.success(res.data.message);

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

  const fruits = myData.filter((item) => item.category === "fruit");
  

  return (
    
    <Container>
      {/* <Search /> */}
      <SearchComponent />
      <Typography variant="h4" component="h2" gutterBottom>
        Fruits List
      </Typography>
      {fruits.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No fruits found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {fruits.map((fruit) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={fruit.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={fruit.image}
                  alt={fruit.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {fruit.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {fruit.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${fruit.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 ,backgroundColor: green[400] }}
                    onClick={() => addToCart(fruit)}
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
