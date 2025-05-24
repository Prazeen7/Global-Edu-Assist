import * as React from "react"
import { useContext, useEffect } from "react"
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Stack,
  Alert,
  Card as MuiCard,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import ForgotPassword from "./ForgotPassword"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import axios from "../../utils/axiosConfig"
import { AuthContext } from "../../Context/context"
import "../Institutions/institutions.css"
import { verifyTokenWithServer } from "../../utils/authService"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "450px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  borderRadius: theme.spacing(1),
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1), 0px 15px 35px rgba(0, 0, 0, 0.05)",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  backgroundImage: "radial-gradient(circle, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}))

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4f46e5",
  color: "#ffffff",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#3a39c1",
  },
  "&.Mui-disabled": {
    backgroundColor: "#a5a4f3",
    color: "#ffffff",
  },
}))

export default function Login() {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("")
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState("")
  const [alertSeverity, setAlertSeverity] = React.useState(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleForgotPasswordOpen = () => setOpen(true)
  const handleForgotPasswordClose = () => setOpen(false)

  const navigate = useNavigate()
  const location = useLocation()
  // Get the redirectTo from location state, default to home page if not provided
  const redirectTo = location.state?.redirectTo || "/"

  const { setLoggedIn, setUserAvatar, setUserType, setUserData } = useContext(AuthContext)

  useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userAvatar")

    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
        setAlertSeverity(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alertMessage])

  useEffect(() => {
    if (emailError || passwordError) {
      const timer = setTimeout(() => {
        setEmailError(false)
        setEmailErrorMessage("")
        setPasswordError(false)
        setPasswordErrorMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [emailError, passwordError])

  const validateInputs = (email, password) => {
    let isValid = true

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true)
      setEmailErrorMessage("Please enter a valid email address.")
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage("")
    }

    if (!password || password.length < 8) {
      setPasswordError(true)
      setPasswordErrorMessage("Password must be at least 8 characters long.")
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage("")
    }

    return isValid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get("email")
    const password = data.get("password")

    if (!validateInputs(email, password)) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const result = await axios.post("/login", { email, password })
      setIsLoading(false)

      if (result.data.message === "Success") {
        const newToken = result.data.auth
        localStorage.setItem("token", newToken)
        localStorage.setItem("userAvatar", result.data.firstName)

        // Store the user type from the response
        const userType = result.data.user || "user"
        localStorage.setItem("userType", userType)

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }

        // Verify the token with the server to get complete user data
        const verificationResult = await verifyTokenWithServer()

        if (verificationResult.isValid) {
          // Update context with user information from server verification
          setLoggedIn(true)
          setUserAvatar(result.data.firstName)
          setUserType(verificationResult.userType)
          setUserData(verificationResult.userData)

          setAlertMessage("Logged in successfully.")
          setAlertSeverity("success")

          // Redirect based on user type
          setTimeout(() => {
            if (verificationResult.userType === "admin") {
              navigate("/admin/dashboard")
            } else if (verificationResult.userType === "agent") {
              navigate("/agent-dashboard")
            } else {
              // For regular users, redirect to the requested page or home
              navigate(redirectTo)
            }
          }, 100)
        } else {
          // Token verification failed
          setAlertMessage("Authentication failed. Please try again.")
          setAlertSeverity("error")
          localStorage.removeItem("token")
          localStorage.removeItem("userType")
          localStorage.removeItem("userAvatar")
        }
      } else if (result.data.requiresVerification) {
        console.log("Redirecting to OTP verification:", email)
        navigate("/verify-email", {
          state: {
            email,
            message: "Please verify your email with the OTP sent to your inbox.",
            redirectTo: redirectTo,
          },
        })
      } else {
        console.log("Login failed:", result.data.message)
        setAlertMessage(`Login failed: ${result.data.message || "Please try again."}`)
        setAlertSeverity("error")
      }
    } catch (err) {
      setIsLoading(false)
      console.error("Login error:", err.response?.data || err.message)
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again later."
      setAlertMessage(`Error: ${errorMessage}`)
      setAlertSeverity("error")

      if (err.response?.data?.requiresVerification) {
        console.log("Redirecting to OTP due to error:", email)
        navigate("/verify-email", {
          state: {
            email,
            message: "Please verify your email with the OTP sent to your inbox.",
            redirectTo: redirectTo,
          },
        })
      }
    }
  }

  const handleForgotPasswordClick = (event) => {
    event.preventDefault()
    handleForgotPasswordOpen()
  }

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer alignItems="center" justifyContent="center">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
            Login
          </Typography>

          {alertMessage && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Stack>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl sx={{ textAlign: "left" }}>
              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                error={emailError}
                helperText={emailErrorMessage}
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ textAlign: "left" }}>
              <TextField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordErrorMessage}
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <PrimaryButton type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </PrimaryButton>
            <Link component="button" onClick={handleForgotPasswordClick} variant="body2" sx={{ alignSelf: "left" }}>
              Forgot your password?
            </Link>
          </Box>
          <Typography textAlign="center">
            Don't have an account?{" "}
            <NavLink
              to="/signup"
              variant="body2"
              style={{
                color: "#0078D7",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Sign up
            </NavLink>
          </Typography>
        </Card>
      </SignInContainer>

      <ForgotPassword open={open} handleClose={handleForgotPasswordClose} />
    </>
  )
}