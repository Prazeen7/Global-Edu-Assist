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
} from '@mui/material';
import axios from 'axios';

function ForgotPassword({ open, handleClose }) {
    const [email, setEmail] = React.useState('');
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post('http://localhost:3001/forgot-password', { email })
            .then((response) => {
                setAlertMessage('An email with the new password has been sent to your inbox.');
                setAlertSeverity('success');
                setTimeout(() => {
                    handleClose();
                    setEmail(''); 
                    setAlertMessage('');  
                    setAlertSeverity(null); 
                }, 2000); 
            })
            .catch((error) => {
                console.error(error);
                setAlertMessage('Failed to send email. Please try again later.');
                setAlertSeverity('error');
            });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
                sx: { backgroundImage: 'none' },
            }}
        >
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
            >
                <DialogContentText>
                    Enter your account&apos;s email address, and we&apos;ll send you a new
                    password.
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
                {alertMessage && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity={alertSeverity}>{alertMessage}</Alert>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
