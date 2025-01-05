import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { NavLink } from 'react-router-dom';

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

  const handleForgotPasswordOpen = () => setOpen(true);
  const handleForgotPasswordClose = () => setOpen(false);

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

    if (validateInputs(email, password)) {
      console.log({ email, password });
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer alignItems="center" justifyContent="center">
        <Card variant="outlined">
          {/* Align Login Title to the Left */}
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ textAlign: 'center' }}
          >
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {/* Align Form Controls to the Left */}
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
              onClick={handleForgotPasswordOpen}
              variant="body2"
              sx={{ alignSelf: 'left' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Typography textAlign="center">
            Don&apos;t have an account?{' '}
            <NavLink to="/signup"
              variant="body2"
              sx={{
                color: '#0078D7',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </NavLink>
          </Typography>
        </Card>
        <ForgotPassword open={open} handleClose={handleForgotPasswordClose} />
      </SignInContainer>
    </>
  );
}
