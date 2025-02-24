import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { green } from "@mui/material/colors";

// Mock function to fetch user data - replace with your actual API call
const fetchUserData = async (userId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        address: "123 Farm Road, Agricultural City",
        joinDate: "2023-05-15",
        orders: 12
      });
    }, 1000);
  });
};

// Mock function to update user data - replace with your actual API call
const updateUserData = async (userData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Profile updated successfully" });
    }, 1000);
  });
};

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  // Fetch user data on component mount
  useEffect(() => {
    // Get user ID from authentication context or localStorage
    const userId = localStorage.getItem("userId") || "user123"; // Replace with your actual user ID source
    
    if (!userId) {
      // Redirect to login if no user is found
      navigate("/login");
      return;
    }
    
    fetchUserData(userId)
      .then(data => {
        setUserData(data);
        setUpdatedData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        setNotification({
          open: true,
          message: "Failed to load profile data",
          severity: "error"
        });
        setLoading(false);
      });
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateUserData(updatedData);
      if (result.success) {
        setUserData(updatedData);
        setNotification({
          open: true,
          message: result.message,
          severity: "success"
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message: "Failed to update profile",
        severity: "error"
      });
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading && !userData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress sx={{ color: green[600] }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 3, py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ color: green[700], fontWeight: "bold" }}>
            Customer Profile
          </Typography>
          <Button 
          variant="contained" 
          sx={{ 
            mt: 2, 
            mb: 2,
            backgroundColor: green[600], 
            "&:hover": { backgroundColor: green[700] } 
          }} 
          onClick={() => navigate("/orders")}
        >
          Order History
        </Button>
          {!editMode ? (
            <Button 
              variant="contained" 
              startIcon={<EditIcon />} 
              onClick={handleEdit}
              sx={{ backgroundColor: green[600], "&:hover": { backgroundColor: green[700] } }}
            >
              Edit Profile
            </Button>
            
          ) : (
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />} 
              onClick={handleSave}
              sx={{ backgroundColor: green[600], "&:hover": { backgroundColor: green[700] } }}
            >
              Save Changes
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar 
            sx={{ width: 120, height: 120, bgcolor: green[500], mr: 4 }}
          >
            <AccountCircleIcon sx={{ fontSize: 80 }} />
          </Avatar>
          <Box>
            <Typography variant="h5">{userData?.name}</Typography>
            <Typography variant="body1" color="textSecondary">Customer since: {userData?.joinDate}</Typography>
            <Typography variant="body1" color="textSecondary">Orders: {userData?.orders}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={editMode ? updatedData.name : userData?.name}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={editMode ? updatedData.email : userData?.email}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={editMode ? updatedData.phone : userData?.phone}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={editMode ? updatedData.address : userData?.address}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              sx={{ mb: 2 }}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: green[700], mb: 2 }}>
            Account Security
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: green[600], 
              color: green[700],
              "&:hover": { borderColor: green[800], backgroundColor: green[50] } 
            }}
          >
            Change Password
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProfilePage;