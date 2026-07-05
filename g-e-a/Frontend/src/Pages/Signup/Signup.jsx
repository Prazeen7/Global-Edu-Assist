import * as React from 'react';
import { useEffect } from 'react';  
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import '../Institutions/institutions.css'

// Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  borderRadius: theme.spacing(1),
  boxShadow:
    '0px 5px 15px rgba(0, 0, 0, 0.1), 0px 15px 35px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundImage:
    'radial-gradient(circle, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3a39c1',
  },
  '&.Mui-disabled': {
    backgroundColor: '#a5a4f3',
    color: '#ffffff',
  },
}));

export default function Signup() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const navigate = useNavigate();

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
        setAlertSeverity(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');

    let isValid = true;

    // Reset all errors
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');
    setConfirmPasswordError(false);
    setConfirmPasswordErrorMessage('');
    setNameError(false);
    setNameErrorMessage('');
    setLastNameError(false);
    setLastNameErrorMessage('');

    // First Name validation
    if (!firstName.value || firstName.value.trim().length < 1) {
      setNameError(true);
      setNameErrorMessage('First name is required.');
      isValid = false;
    }

    // Last Name validation
    if (!lastName.value || lastName.value.trim().length < 1) {
      setLastNameError(true);
      setLastNameErrorMessage('Last name is required.');
      isValid = false;
    }

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    }

    // Password validation
    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one uppercase letter and one special character.');
      isValid = false;
    }

    // Confirm Password validation
    if (password.value !== confirmPassword.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Validate inputs
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }
  
    const form = event.currentTarget;
    const formData = new FormData(form);
  
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    setIsLoading(true);
  
    axios
      .post('http://localhost:3001/api/registerUser', data)
      .then((result) => {
        setIsLoading(false);
        setAlertSeverity("success");
        setAlertMessage("Successfully Registered")
        // Navigate to verify-email page with the email
        navigate('/verify-email', { 
          state: { 
            email: data.email,
            message: "Registration successful! Please verify your email."
          } 
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('Error during registration:', err);
        
        let errorMessage = 'An error occurred during registration. Please try again.';
        
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
          
          if (err.response.data.error === "Email is already registered") {
            setEmailError(true);
            setEmailErrorMessage("Email is already registered.");
          } else if (err.response.data.error.includes("Password must be")) {
            setPasswordError(true);
            setPasswordErrorMessage(err.response.data.error);
          }
        }
        
        setAlertMessage(errorMessage);
        setAlertSeverity('error');
      });
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" fontWeight="bold" sx={{ textAlign: 'center' }}>
            Sign up
          </Typography>

          {/* Alert Message */}
          {alertMessage && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Stack>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* First Name */}
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                autoComplete="firstName"
                name="firstName"
                required
                fullWidth
                id="firstName"
                placeholder="First Name"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>

            {/* Last Name */}
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                autoComplete="lastName"
                name="lastName"
                required
                fullWidth
                id="lastName"
                placeholder="Last Name"
                error={lastNameError}
                helperText={lastNameErrorMessage}
                color={lastNameError ? 'error' : 'primary'}
              />
            </FormControl>

            {/* Email */}
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="Email"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>

            {/* Password */}
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Confirm Password */}
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="confirmPassword"
                variant="outlined"
                error={confirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                color={confirmPasswordError ? 'error' : 'primary'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <PrimaryButton 
              type="submit" 
              fullWidth 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign up'
              )}
            </PrimaryButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <NavLink to="/login" variant="body2" sx={{ alignSelf: 'center' }}>
                Login
              </NavLink>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}