import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Container,
  IconButton,
  Grid,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageIcon from "@mui/icons-material/Image";
import CancelIcon from "@mui/icons-material/Cancel";

export default function AddProduct() {
  const navigate = useNavigate();
  
  // State variables
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  
  // Category options
  const categoryOptions = ["fruit", "vegetable", "grain"];
  
  // New state for base64 image
  const [imageBase64, setImageBase64] = useState("");
  const [imageFile, setImageFile] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle file input change
  const handleImageChange = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const base64String = await fileToBase64(file);
        setImageBase64(base64String);
        setImageFile(file);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraActive(true);
      
      // Clean up any previous stream
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  // Function to capture an image from the camera
  const captureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get base64 from canvas
      const base64String = canvas.toDataURL("image/jpeg");
      setImageBase64(base64String);
      
      // Also create a file for form submission
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
        setImageFile(file);
      }, "image/jpeg");
      
      // Stop camera after capturing
      stopCamera();
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };
  
  // Function to stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Function to delete image
  const deleteImage = () => {
    setImageBase64("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to cancel camera
  const cancelCamera = () => {
    stopCamera();
  };

  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName || !price || !category || !stock || !description || !city || !imageFile) {
      alert("Please fill in all required fields");
      return;
    }

    let cityArray = city.split(",");
    const formData = new FormData();
    formData.append("image", imageFile);
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
      navigate("/products");
    } catch (error) {
      console.error("There was an error adding the product!", error);
      alert("Failed to add product");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, my: 4 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Add New Product
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="Product Name" value={productName} onChange={(e) => setproductName(e.target.value)} required />
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
              required
            />
          </Box>
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
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Box>

          {/* File Upload */}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* Camera Capture Section */}
          {!cameraActive && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={startCamera}
              sx={{ my: 2 }}
            >
              Open Camera
            </Button>
          )}

          {/* Always keep <video> in the DOM, but hide it when not active */}
          <Box>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                display: cameraActive ? "block" : "none",
              }}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ backgroundColor: green[600] }}
          >
            Add Product
          </Button>
        </form>
      </Paper>
    </Container>
  );
}