import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    OutlinedInput,
    Stack,
    Alert,
    Typography,
    CircularProgress,
    TextField
} from '@mui/material';
import axios from 'axios';

function ForgotPassword({ open, handleClose }) {
    const [email, setEmail] = React.useState('');
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState(null);
    const [step, setStep] = React.useState(1);
    const [otp, setOtp] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmitEmail = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:3001/api/forgot-password', { email });
            setAlertMessage(response.data.message);
            setAlertSeverity('success');
            setStep(2);
        } catch (error) {
            setAlertMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
            setAlertSeverity('error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:3001/api/verify-otp', { email, otp });
            setAlertMessage(response.data.message);
            setAlertSeverity('success');
            setStep(3);
        } catch (error) {
            setAlertMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
            setAlertSeverity('error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setAlertMessage("Passwords don't match");
            setAlertSeverity('error');
            return;
        }

        if (newPassword.length < 6) {
            setAlertMessage("Password must be at least 6 characters");
            setAlertSeverity('error');
            return;
        }

        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:3001/api/reset-password', { 
                email, 
                newPassword 
            });
            setAlertMessage(response.data.message);
            setAlertSeverity('success');
            
            setTimeout(() => {
                handleClose();
                resetForm();
            }, 2000);
        } catch (error) {
            setAlertMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
            setAlertSeverity('error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setAlertMessage('');
        setAlertSeverity(null);
        setStep(1);
    };

    const handleCloseDialog = () => {
        handleClose();
        resetForm();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            PaperProps={{
                component: 'form',
                sx: { backgroundImage: 'none', minWidth: '400px' },
            }}
        >
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
            >
                {step === 1 && (
                    <>
                        <DialogContentText>
                            Enter your account's email address to receive an OTP for password reset.
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
                            required
                            margin="dense"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            type="email"
                            fullWidth
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <DialogContentText>
                            We've sent a 6-digit OTP to {email}. Please enter it below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            type="text"
                            inputProps={{ maxLength: 6 }}
                            fullWidth
                        />
                    </>
                )}

                {step === 3 && (
                    <>
                        <DialogContentText>
                            Create a new password for your account.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            type="password"
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            type="password"
                            fullWidth
                        />
                    </>
                )}

                {alertMessage && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity={alertSeverity}>{alertMessage}</Alert>
                    </Stack>
                )}

                {loading && (
                    <Stack alignItems="center">
                        <CircularProgress />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                {step === 1 && (
                    <Button variant="contained" type="submit" onClick={handleSubmitEmail}>
                        Send OTP
                    </Button>
                )}
                {step === 2 && (
                    <Button variant="contained" type="submit" onClick={handleVerifyOTP}>
                        Verify OTP
                    </Button>
                )}
                {step === 3 && (
                    <Button variant="contained" type="submit" onClick={handleResetPassword}>
                        Reset Password
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ForgotPassword;