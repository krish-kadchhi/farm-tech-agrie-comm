import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [role, setRole] = useState(""); // State for role selection
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const getData = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      email: email,
      phone: phone,
      address: address,
      password: password,
      role: role,
    };

    if (
      data.username === "" ||
      data.email === "" ||
      data.password === "" ||
      data.role === ""
    ) {
      alert("All fields are required");
    } else {

      navigate("/verifyOtp");
      await axios
        .post("http://localhost:8080/auth/signup", data)
        .then((res) => {
          console.log(res.data);
          // Cookies.set("userId", res.data.userId);
        })
        .catch((err) => console.log(err));
      // navigate("/products");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={getData}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Phone"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              Lable="Address"
              required
            />
          </Box>
          {/* Role Dropdown */}
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
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                color="primary"
              />
            }
            label="Show Password"
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mb: 2, backgroundColor: green[600] }}
          >
            Sign Up
          </Button>
        </form>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Login here
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}
