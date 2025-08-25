"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
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
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Email, Phone, Home, Key } from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#388E3C", // A professional green shade
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    background: {
      default: "#F5F5F5",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#2E7D32",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px",
        },
      },
    },
  },
})

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      setOpenSnackbar(true)
      return
    }

    setLoading(true)
    try {
      const response = await axios.post("https://farm-tech-agrie-comm.onrender.com/auth/signup", formData,{
          withCredentials: true,
        })
      console.log(response.data)
      setTimeout(() => {
        navigate("/verifyOtp")
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 1,
            marginBottom: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              width: "100%",
              borderRadius: "12px",
              backgroundColor: "white",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 4,
                textAlign: "center",
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Create Account
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
              />

              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
              />

              <TextField
                fullWidth
                name="phone"
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
              />

              <TextField
                fullWidth
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="primary" />
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select name="role" value={formData.role} onChange={handleChange} label="Role">
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Farmer">Farmer</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Key color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton> */}
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={showPassword} onChange={() => setShowPassword(!showPassword)} color="primary" />
                }
                label="Show Password"
                sx={{ mt: 1 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>

              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Typography
                  component="a"
                  href="/login"
                  color="primary"
                  sx={{
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Login here
                </Typography>
              </Typography>
            </form>
          </Paper>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

