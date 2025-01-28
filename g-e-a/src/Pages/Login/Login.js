import * as React from 'react';
import { useContext } from "react";
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../../Context/context";

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

const SignInContainer = styled(Stack)(({ theme }) => ({
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

// Main Component
export default function Login() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState(null);

  const handleForgotPasswordOpen = () => setOpen(true);
  const handleForgotPasswordClose = () => setOpen(false);

  const navigate = useNavigate();

  const { setLoggedIn } = useContext(AuthContext);
  const { setUserAvatar } = useContext(AuthContext);
  const { setUserType } = useContext(AuthContext);

  const validateInputs = (email, password) => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!validateInputs(email, password)) return;

    axios
      .post('http://localhost:3001/login', { email, password })
      .then((result) => {
        if (result.data.message === 'Success') {
          setAlertMessage('Logged in successfully.');
          setAlertSeverity('success');
          setLoggedIn(true);
          setUserAvatar(result.data.firstName);
          setUserType(result.data.user);
          navigate('/');
        } else {
          setAlertMessage(result.data.message || 'Login failed.');
          setAlertSeverity('error');
        }
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage('An error occurred. Please try again later.');
        setAlertSeverity('error');
      });
  };


  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    handleForgotPasswordOpen();
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer alignItems="center" justifyContent="center">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ textAlign: 'center' }}
          >
            Login
          </Typography>

          {/* Alert Message */}
          {alertMessage && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Stack>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl sx={{ textAlign: 'left' }}>
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
              />
            </FormControl>
            <FormControl sx={{ textAlign: 'left' }}>
              <TextField
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordErrorMessage}
                required
                fullWidth
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <PrimaryButton type="submit" fullWidth variant="contained">
              Login
            </PrimaryButton>
            <Link
              component="button"
              onClick={handleForgotPasswordClick}
              variant="body2"
              sx={{ alignSelf: 'left' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Typography textAlign="center">
            Don&apos;t have an account?{' '}
            <NavLink
              to="/signup"
              variant="body2"
              style={{
                color: '#0078D7',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Sign up
            </NavLink>
          </Typography>
        </Card>
      </SignInContainer>

      {/* Forgot Password Modal */}
      <ForgotPassword open={open} handleClose={handleForgotPasswordClose} />
    </>
  );
}
