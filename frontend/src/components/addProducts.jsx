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
import { API_ENDPOINTS } from "../config/api";

export default function AddProduct() {
  const navigate = useNavigate();
  
  // State variables
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState(""); // Changed from city to district
  const [category, setCategory] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  
  // Category options
  const categoryOptions = ["fruit", "vegetable", "grain"];
  
  // Gujarat districts
  const gujaratDistricts = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", 
    "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", 
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", 
    "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", 
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
    "Tapi", "Vadodara", "Valsad"
  ];
  
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
    
    if (!productName || !price || !category || !stock || !description || !district || !imageFile) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("cityArray", [district]); // Using district as a single-item array

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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Product Name" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                required 
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Stock" 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                required 
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* District Dropdown - Replacing City TextField */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="district-label">District</InputLabel>
                <Select
                  labelId="district-label"
                  value={district}
                  label="District"
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {gujaratDistricts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Description" 
                multiline 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </Grid>
            
            {/* Image Preview Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Product Image
              </Typography>
              
              {imageBase64 ? (
                <Box sx={{ position: 'relative', mt: 2, mb: 2, textAlign: 'center' }}>
                  <img 
                    src={imageBase64} 
                    alt="Product preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }} 
                  />
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8,
                      backgroundColor: red[50],
                      '&:hover': { backgroundColor: red[100] }
                    }}
                    onClick={deleteImage}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {cameraActive ? (
                    <Box sx={{ position: 'relative' }}>
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        style={{ 
                          width: "100%", 
                          border: '1px solid #ddd',
                          borderRadius: '4px' 
                        }} 
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mt: 1 
                      }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={captureImage}
                          startIcon={<CameraAltIcon />}
                        >
                          Capture
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={cancelCamera}
                          startIcon={<CancelIcon />}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      gap: 2 
                    }}>
                      <Button 
                        variant="outlined" 
                        component="label" 
                        fullWidth
                        startIcon={<ImageIcon />}
                      >
                        Choose File
                        <input 
                          type="file" 
                          hidden 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          ref={fileInputRef}
                        />
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        fullWidth
                        onClick={startCamera}
                        startIcon={<CameraAltIcon />}
                      >
                        Open Camera
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </Grid>
          </Grid>

          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
              mt: 4, 
              mb: 2, 
              py: 1.5,
              backgroundColor: green[600],
              '&:hover': { backgroundColor: green[700] },
              fontWeight: 'bold'
            }}
          >
            Add Product
          </Button>
        </form>
      </Paper>
    </Container>
  );
}