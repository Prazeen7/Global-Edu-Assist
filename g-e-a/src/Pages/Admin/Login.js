import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Context/context';

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
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1), 0px 15px 35px rgba(0, 0, 0, 0.05)',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100vh',
    padding: theme.spacing(2),
    backgroundImage: 'radial-gradient(circle, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const { setLoggedIn, setUserAvatar, setUserType } = useContext(AuthContext);

    // Load saved email from localStorage (avoid storing password)
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const validateInputs = () => {
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) return;

        try {
            const response = await axios.post('http://localhost:3001/api/admin-login', { email, password });
            const { message, auth, firstName, user } = response.data;

            if (message === 'Success') {
                localStorage.setItem('token', auth);
                localStorage.setItem('userAvatar', firstName);
                localStorage.setItem('userType', user);

                // Save email only if "Remember Me" is checked
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                setLoggedIn(true);
                setUserAvatar(firstName);
                setUserType(user);

                setAlertMessage('Logged in successfully.');
                setAlertSeverity('success');

                navigate('/admin/dashboard');
            } else {
                setAlertMessage(message || 'Login failed.');
                setAlertSeverity('error');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            setAlertMessage(errorMessage);
            setAlertSeverity('error');
        }
    };

    const handleForgotPasswordOpen = () => setOpen(true);
    const handleForgotPasswordClose = () => setOpen(false);

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer alignItems="center" justifyContent="center">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4" fontWeight="bold" sx={{ textAlign: 'center' }}>
                        Admin Login
                    </Typography>

                    {alertMessage && (
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity={alertSeverity}>{alertMessage}</Alert>
                        </Stack>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ textAlign: 'left' }}>
                            <TextField
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
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
                            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                            label="Remember me"
                        />
                        <PrimaryButton type="submit" fullWidth variant="contained">
                            Login
                        </PrimaryButton>
                        <Typography variant="body2" sx={{ alignSelf: 'left', color: 'text.secondary' }}>
                            Note: Admin password reset is not available through this portal. Contact support for assistance.
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>

            <ForgotPassword open={open} handleClose={handleForgotPasswordClose} />
        </>
    );
}