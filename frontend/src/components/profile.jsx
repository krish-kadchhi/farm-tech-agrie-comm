import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import Cookies from "js-cookie";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import { green } from "@mui/material/colors";
import { jwtDecode } from "jwt-decode";


// Mock function to update user data - replace with your actual API call
const updateUserData = async (userData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Profile updated successfully" });
    }, 1000);
  });
};

// Logout function
const logoutUser = async () => {
  // Simulate API call for logout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Try to fetch profile directly from API - this will work if user is authenticated
        const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
          withCredentials: true
        });
        
        if (response.data.success && response.data.user) {
          setUserData(response.data.user);
          setUpdatedData(response.data.user);
          setLoading(false);
        } else {
          console.log("No valid user data in response, redirecting to login");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        // If 401 or any auth error, redirect to login
        if (error.response?.status === 401 || !error.response) {
          console.log("Authentication failed, redirecting to login");
          navigate("/login");
          return;
        }
        
        // For other errors, show error message but don't redirect
        setNotification({
          open: true,
          message: "Failed to load profile data",
          severity: "error"
        });
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        API_ENDPOINTS.AUTH.EDIT_PROFILE,
        updatedData,
        {
          withCredentials: true
        }
      );
  
      if (response.data.success) {
        setUserData(response.data.user);
        setNotification({
          open: true,
          message: response.data.message,
          severity: "success"
        });
        
        // Dispatch event to update products
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update profile",
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

  const handleLogoutClick = () => {
    setLogoutDialog(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialog(false);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      // Clear any client-side auth state
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      sessionStorage.clear();

      // Clear the loginCookie using js-cookie with proper settings
      Cookies.remove("loginCookie", { 
        path: "/", 
        sameSite: "None", 
        secure: true 
      });

      // Also try to clear via document.cookie as backup with multiple variations
      document.cookie = "loginCookie=; Max-Age=0; path=/; SameSite=None; Secure";
      document.cookie = "loginCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = "loginCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure";

      // Dispatch event to notify layout component about auth change
      window.dispatchEvent(new Event('authChanged'));

      setNotification({
        open: true,
        message: "Logged out successfully",
        severity: "success"
      });

      setTimeout(() => {
        navigate("/signup");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      setNotification({
        open: true,
        message: "Failed to logout. Please try again.",
        severity: "error"
      });
    } finally {
      setLoggingOut(false);
      setLogoutDialog(false);
    }
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
        {/* Header with title and buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ color: green[700], fontWeight: "bold" }}>
            Customer Profile
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="contained" 
              sx={{ 
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
            
            <Button 
              variant="outlined" 
              startIcon={<LogoutIcon />} 
              onClick={handleLogoutClick}
              sx={{ 
                borderColor: "error.main", 
                color: "error.main",
                "&:hover": { 
                  backgroundColor: "error.light", 
                  borderColor: "error.dark",
                  color: "white"
                } 
              }}
            >
              Logout
            </Button>
          </Box>
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
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </Button>
        </Box>
      </Paper>

      {/* Logout confirmation dialog */}
      <Dialog
        open={logoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          {"Confirm Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? You will need to sign in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutConfirm} 
            color="error" 
            variant="contained"
            disabled={loggingOut}
            startIcon={loggingOut ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
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