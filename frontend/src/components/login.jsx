//login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  // Login.js component
  const getData = async (e) => {
    e.preventDefault();
    const data = { username, email, role, password }; // Include role

    if (!data.username || !data.email || !data.password || !data.role) {
      alert("Please fill in all required fields");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8080/auth/login",
          data,
          {
            withCredentials: true, // Important for cookies
          }
        );
        console.log("Login response:", response.data);
        if (data.role === "Admin") {
          // console.log("Admin login successful");
          navigate("/addProduct");
        } else {
          navigate("/products");
        }
      } catch (err) {
        alert(err.response?.data || "Login failed");
      }
    }
  };

  const showPass = () => {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login Page
        </Typography>
        <form onSubmit={getData}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          {/* <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              label="Phone"
              variant="outlined"
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              type="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              label="Please Enter City only"
              required
            />
          </Box> */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Farmer">Farmer</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              id="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </Box>
          <FormControlLabel
            control={<Checkbox onClick={showPass} />}
            label="Show Password"
          />
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ backgroundColor: green[700] }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}