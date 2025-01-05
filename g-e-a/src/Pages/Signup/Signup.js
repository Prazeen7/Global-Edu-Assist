import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';

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
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

  const navigate = useNavigate(); // Using the hook for navigation

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');

    let isValid = true;

    // email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Password validation
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // Confirm Password validation
    if (!confirmPassword.value || confirmPassword.value.length < 6) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    // Name validation
    if (!firstName.value || firstName.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('First name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    // Last Name validation
    if (!lastName.value || lastName.value.length < 1) {
      setLastNameError(true);
      setLastNameErrorMessage('Last name is required.');
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // handling invalid input
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

    console.log("Formatted Data:", data);

    axios
      .post('http://localhost:3001/registerUser', data)
      .then((result) => {
        console.log(result);
        setShowSuccessAlert(true); 
        setEmailError(false); 
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      })
      .catch((err) => {
        console.error('Error during registration:', err); 
        if (err.response && err.response.data && err.response.data.error) {
          if (err.response.data.error === "Email is already taken") {
            setEmailError(true);
            setEmailErrorMessage("Email is already taken.");
          }
        }
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

          {/* Success Alert */}
          {showSuccessAlert && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="success">Signed up Successfully</Alert>
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
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>

            {/* Confirm Password */}
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirmPassword"
                variant="outlined"
                error={confirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                color={confirmPasswordError ? 'error' : 'primary'}
              />
            </FormControl>

            <PrimaryButton type="submit" fullWidth variant="contained">
              Sign up
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
