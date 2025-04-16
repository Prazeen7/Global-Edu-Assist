import * as React from 'react';
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
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from "../Context/context";

// Styled Components (same as your Signup component)
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

const VerifyContainer = styled(Stack)(({ theme }) => ({
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

export default function VerifyEmail() {
    const [otp, setOtp] = React.useState('');
    const [otpError, setOtpError] = React.useState(false);
    const [otpErrorMessage, setOtpErrorMessage] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [alert, setAlert] = React.useState({ show: false, message: '', severity: '' });
    const [isLoading, setIsLoading] = React.useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { setLoggedIn, setUserAvatar, setUserType } = React.useContext(AuthContext);

    React.useEffect(() => {
        // Get email from location state or query params
        const searchParams = new URLSearchParams(location.search);
        const emailParam = searchParams.get('email') || location.state?.email;
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!otp || otp.length !== 6) {
            setOtpError(true);
            setOtpErrorMessage('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setAlert({ show: false, message: '', severity: '' });

        try {
            const response = await axios.post('http://localhost:3001/api/verify-otp', { email, otp });

            // Store the token and user data in localStorage
            localStorage.setItem('token', response.data.auth);
            localStorage.setItem('userAvatar', response.data.firstName);
            localStorage.setItem('userType', response.data.user);

            // Update auth context
            setLoggedIn(true);
            setUserAvatar(response.data.firstName);
            setUserType(response.data.user);

            setAlert({
                show: true,
                message: 'Email verified successfully! Redirecting...',
                severity: 'success'
            });

            // Redirect to home page after 2 seconds
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            console.error('Verification error:', err);
            setAlert({
                show: true,
                message: err.response?.data?.message || 'Verification failed. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            setAlert({
                show: true,
                message: 'Email not found. Please try signing up again.',
                severity: 'error'
            });
            return;
        }

        setIsLoading(true);
        setAlert({ show: false, message: '', severity: '' });

        try {
            await axios.post('http://localhost:3001/api/resend-otp', { email });
            setAlert({
                show: true,
                message: 'New OTP sent to your email!',
                severity: 'success'
            });
        } catch (err) {
            console.error('Resend error:', err);
            setAlert({
                show: true,
                message: err.response?.data?.message || 'Failed to resend OTP. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <VerifyContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4" fontWeight="bold" sx={{ textAlign: 'center' }}>
                        Verify Your Email
                    </Typography>

                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                        We've sent a 6-digit verification code to {email || 'your email'}
                    </Typography>

                    {/* Alert */}
                    {alert.show && (
                        <Alert severity={alert.severity} sx={{ mb: 2 }}>
                            {alert.message}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {/* OTP Input */}
                        <FormControl sx={{ textAlign: 'left' }}>
                            <TextField
                                required
                                fullWidth
                                id="otp"
                                placeholder="Enter 6-digit OTP"
                                name="otp"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                    setOtpError(false);
                                    setOtpErrorMessage('');
                                }}
                                error={otpError}
                                helperText={otpErrorMessage}
                                inputProps={{
                                    maxLength: 6,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*'
                                }}
                            />
                        </FormControl>

                        <PrimaryButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </PrimaryButton>

                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            Didn't receive the code?{' '}
                            <Button
                                variant="text"
                                onClick={handleResendOTP}
                                disabled={isLoading}
                                sx={{
                                    color: '#4f46e5',
                                    textTransform: 'none',
                                    minWidth: 'unset',
                                    padding: 0
                                }}
                            >
                                Resend OTP
                            </Button>
                        </Typography>
                    </Box>
                </Card>
            </VerifyContainer>
        </>
    );
}