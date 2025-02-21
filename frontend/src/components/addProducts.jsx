import { useState, useRef } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
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
// const navigate= useNavigate();

export default function AddProduct() {
  const getData = async (e) => {
    e.preventDefault();
    let cityArray = city.split(",");
    const data = { productName, price, category, stock, description, cityArray, image };
    console.log(cityArray);
    if (
      !data.productName ||
      !data.price ||
      !data.category ||
      !data.stock ||
      !data.description ||
      !data.cityArray ||
      !data.image
    ) {
      alert("Please fill in all required fields");
    } else {

      const formData = new FormData();
      formData.append("image", image);
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("description", description);
      formData.append("cityArray", cityArray);
      try {
        const response = await axios.post(
          "http://localhost:8080/item/add",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", 
            }, 
          }
        );
        alert("Product added successfully");
              // navigate("/products");
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
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Function to handle file input change
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
    // Navigate("/products");
  };

  // Function to start the camera
  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        setCameraActive(true); // Ensure <video> is rendered before setting srcObject

        setTimeout(() => {  // Give React time to update the DOM
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            } else {
                console.error("Video element not found");
            }
        }, 100); // Delay to allow video element to be available

    } catch (error) {
        console.error("Error accessing camera:", error);
    }
};


  // Function to capture an image from the camera
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to a Blob and store it as a file
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
      setImage(file);
    }, "image/jpeg");

    // Stop the camera after capturing
    video.srcObject.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  // Function to submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName || !price || !category || !stock || !description || !city || !image) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("cityArray", city.split(","));

    try {
      await axios.post("http://localhost:8080/item/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully");
    } catch (error) {
      console.error("There was an error adding the product!", error);
      alert("Failed to add product");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add Products Here
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="Product Name" value={productName} onChange={(e) => setproductName(e.target.value)} required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="Category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="City" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
          </Box>
  
          {/* File Upload */}
          <input type="file" accept="image/*" onChange={handleImageChange}  />
  
          {/* Camera Capture Section */}
          {!cameraActive && (
            <Button variant="contained" color="secondary" fullWidth onClick={startCamera} sx={{ my: 2 }}>
              Open Camera
            </Button>
          )}
  
          {/* Always keep <video> in the DOM, but hide it when not active */}
          <Box>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              style={{ width: "100%", display: cameraActive ? "block" : "none" }} 
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            
            {cameraActive && (
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={captureImage} 
                sx={{ my: 2 }}
              >
                Capture Image
              </Button>
            )}
          </Box>
  
          <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: green[600] }}>
            Add Product
          </Button>
        </form>
      </Paper>
    </Container>
  );
  
}
