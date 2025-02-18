"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
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
import { Visibility, VisibilityOff, Person, Email, Key } from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Custom theme (same as signup page)
const theme = createTheme({
  palette: {
    primary: {
      main: "#388E3C",
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

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields")
      return false
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address")
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
      const response = await axios.post("http://localhost:8080/auth/login", formData, {
        withCredentials: true,
      })
      console.log("Login response:", response.data)
      if (formData.role === "Admin") {
        navigate("/addProduct")
      } else {
        navigate("/products")
      }
    } catch (err) {
      setError(err.response?.data || "Login failed")
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
              Login
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
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
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
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select name="role" value={formData.role} onChange={handleChange} label="Role">
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Farmer">Farmer</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
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
                autoComplete="off"
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>

              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Typography
                  component="a"
                  href="/signup"
                  color="primary"
                  sx={{
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up here
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

