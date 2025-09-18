"use client"

import { useState } from "react"
import axios from "axios"
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Container,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { Email } from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { API_ENDPOINTS } from "../config/api";

// Use the same theme as in your Login component
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address")
      setOpenSnackbar(true)
      return
    }

    setLoading(true)
    try {
      const response = await axios.post("API_ENDPOINTS.AUTH.FORGOT_PASSWORD", { email })
      setSuccess(true)
      setError("")
    } catch (err) {
      setSuccess(false)
      setError(err.response?.data?.message || "Failed to process your request")
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
            marginTop: 8,
            marginBottom: 8,
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
                mb: 3,
                textAlign: "center",
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Forgot Password
            </Typography>

            {success ? (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Password reset link has been sent to your email
                </Alert>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Please check your email inbox for instructions to reset your password.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If you don't see the email, please check your spam folder.
                </Typography>
                <Button
                  href="/login"
                  variant="outlined"
                  sx={{ mt: 3 }}
                >
                  Back to Login
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
                </Button>

                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
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
                    Back to Login
                  </Typography>
                </Typography>
              </form>
            )}
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