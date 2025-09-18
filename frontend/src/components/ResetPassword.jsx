
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import axios from "axios"
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { Visibility, VisibilityOff, Key } from "@mui/icons-material"
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

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // You might want to add an endpoint to validate the token
        // For now, we'll assume it's valid if it exists
        if (!token) {
          setTokenValid(false)
        }
        setTokenValid(true)
      } catch (err) {
        setTokenValid(false)
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setOpenSnackbar(true)
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setOpenSnackbar(true)
      return
    }

    setLoading(true)
    try {
        await axios.post(`API_ENDPOINTS.AUTH.RESET_PASSWORD/${token}`, {
            newPassword: password
          })
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Validating your reset link...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    )
  }

  if (!tokenValid) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              marginTop: 8,
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
              <Alert severity="error" sx={{ mb: 3 }}>
                Invalid or expired reset link
              </Alert>
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                The password reset link is invalid or has expired.
              </Typography>
              <Button
                component={RouterLink}
                to="/forgot-password"
                variant="contained"
                fullWidth
                sx={{ mb: 2 }}
              >
                Request a new reset link
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
              >
                Back to Login
              </Button>
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
    )
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
              Reset Your Password
            </Typography>

            {success ? (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Password reset successful!
                </Alert>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Go to Login
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Enter your new password below.
                </Typography>

                <TextField
                  fullWidth
                  name="password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Key color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Key color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={showPassword} 
                      onChange={() => setShowPassword(!showPassword)} 
                      color="primary" 
                    />
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                </Button>
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