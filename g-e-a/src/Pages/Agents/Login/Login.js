"use client"
import { useContext, useEffect, useState } from "react"
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
import axios from "../../../utils/axiosConfig"
import { AuthContext } from "../../../Context/context"
import "../../Institutions/institutions.css"

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
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [open, setOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertSeverity, setAlertSeverity] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPasswordOpen = () => setOpen(true)
  const handleForgotPasswordClose = () => setOpen(false)

  const navigate = useNavigate()
  const location = useLocation()

  const { setLoggedIn, setUserAvatar, setUserType, logout } = useContext(AuthContext) || {}

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
      const result = await axios.post("/agent/login", { email, password })
      setIsLoading(false)

      if (result.data.success) {
        const agentData = result.data.data
        const token = result.data.token

        // Store the JWT token
        localStorage.setItem("token", token)
        localStorage.setItem("userAvatar", agentData.companyName)
        localStorage.setItem("userType", "agent")
        localStorage.setItem("agentData", JSON.stringify(agentData))

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }

        setLoggedIn(true)
        setUserAvatar(agentData.companyName)
        setUserType("agent")

        setAlertMessage("Logged in successfully.")
        setAlertSeverity("success")

        navigate("/agent-dashboard")
        return
      }
    } catch (err) {
      setIsLoading(false)
      console.error("Login error:", err.response?.data || err.message)

      if (err.response?.data) {
        const { status, error } = err.response.data

        if (status === "pending") {
          setAlertMessage("Your account is pending approval. Please check your email for updates.")
          setAlertSeverity("info")
        } else if (status === "rejected") {
          setAlertMessage("Your registration has been rejected. Please check your email for details.")
          setAlertSeverity("error")
        } else {
          setAlertMessage(`Error: ${error || "An error occurred. Please try again later."}`)
          setAlertSeverity("error")
        }
      } else {
        setAlertMessage("An error occurred. Please try again later.")
        setAlertSeverity("error")
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
            Agent Login
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
              to="/agent-registration"
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