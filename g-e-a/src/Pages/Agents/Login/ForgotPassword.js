import { useState } from "react"
import PropTypes from "prop-types"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Stack,
    Alert,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import axios from "../../../utils/axiosConfig"

const BRAND_COLOR = "#4f46e5"

const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: BRAND_COLOR,
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

function ForgotPassword({ open, handleClose }) {
    const [email, setEmail] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [alertSeverity, setAlertSeverity] = useState(null)
    const [step, setStep] = useState(1)
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState("")
    const [otpError, setOtpError] = useState(false)
    const [otpErrorMessage, setOtpErrorMessage] = useState("")
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("")

    const validateEmail = (email) => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true)
            setEmailErrorMessage("Please enter a valid email address.")
            return false
        }
        setEmailError(false)
        setEmailErrorMessage("")
        return true
    }

    const validateOtp = (otp) => {
        if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
            setOtpError(true)
            setOtpErrorMessage("Please enter a valid 6-digit OTP.")
            return false
        }
        setOtpError(false)
        setOtpErrorMessage("")
        return true
    }

    const validatePassword = (password) => {
        if (!password || password.length < 8) {
            setPasswordError(true)
            setPasswordErrorMessage("Password must be at least 8 characters long.")
            return false
        }
        setPasswordError(false)
        setPasswordErrorMessage("")
        return true
    }

    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            setConfirmPasswordError(true)
            setConfirmPasswordErrorMessage("Passwords don't match.")
            return false
        }
        setConfirmPasswordError(false)
        setConfirmPasswordErrorMessage("")
        return true
    }

    const handleSubmitEmail = async (event) => {
        event.preventDefault()

        if (!validateEmail(email)) {
            return
        }

        setLoading(true)
        setAlertMessage("")
        setAlertSeverity(null)

        try {
            const response = await axios.post("/api/agent/forgot-password", { email })
            setAlertMessage(response.data.message || "OTP sent successfully to your email")
            setAlertSeverity("success")
            setStep(2)
        } catch (error) {
            console.error("Error sending OTP:", error)
            setAlertMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to send OTP. Please verify your email address.",
            )
            setAlertSeverity("error")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (event) => {
        event.preventDefault()

        if (!validateOtp(otp)) {
            return
        }

        setLoading(true)
        setAlertMessage("")
        setAlertSeverity(null)

        try {
            const response = await axios.post("/api/agent/verify-otp", { email, otp })
            setAlertMessage(response.data.message || "OTP verified successfully")
            setAlertSeverity("success")
            setStep(3)
        } catch (error) {
            console.error("Error verifying OTP:", error)
            setAlertMessage(
                error.response?.data?.message || error.response?.data?.error || "Invalid or expired OTP. Please try again.",
            )
            setAlertSeverity("error")
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (event) => {
        event.preventDefault()

        const isPasswordValid = validatePassword(newPassword)
        const isConfirmPasswordValid = validateConfirmPassword(newPassword, confirmPassword)

        if (!isPasswordValid || !isConfirmPasswordValid) {
            return
        }

        setLoading(true)
        setAlertMessage("")
        setAlertSeverity(null)

        try {
            const response = await axios.post("/api/agent/reset-password", {
                email,
                otp,
                newPassword,
            })
            setAlertMessage(response.data.message || "Password reset successfully")
            setAlertSeverity("success")

            setTimeout(() => {
                handleClose()
                resetForm()
            }, 2000)
        } catch (error) {
            console.error("Error resetting password:", error)
            setAlertMessage(
                error.response?.data?.message || error.response?.data?.error || "Failed to reset password. Please try again.",
            )
            setAlertSeverity("error")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setAlertMessage("")
        setAlertSeverity(null)
        setStep(1)
        setEmailError(false)
        setEmailErrorMessage("")
        setOtpError(false)
        setOtpErrorMessage("")
        setPasswordError(false)
        setPasswordErrorMessage("")
        setConfirmPasswordError(false)
        setConfirmPasswordErrorMessage("")
    }

    const handleCloseDialog = () => {
        handleClose()
        resetForm()
    }

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            PaperProps={{
                component: "form",
                sx: { backgroundImage: "none", minWidth: { xs: "90%", sm: "450px" }, maxWidth: "500px" },
            }}
        >
            <DialogTitle sx={{ color: BRAND_COLOR, fontWeight: "bold", pb: 1 }}>Reset Agent Password</DialogTitle>

            {alertMessage && (
                <Box sx={{ px: 3 }}>
                    <Alert severity={alertSeverity} sx={{ mb: 2 }}>
                        {alertMessage}
                    </Alert>
                </Box>
            )}

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", pt: 1 }}>
                {step === 1 && (
                    <>
                        <DialogContentText>
                            Enter your agent account's email address to receive an OTP for password reset.
                        </DialogContentText>
                        <TextField
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
                            error={emailError}
                            helperText={emailErrorMessage}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <DialogContentText>
                            We've sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below.
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
                            error={otpError}
                            helperText={otpErrorMessage}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Didn't receive the OTP?
                            <Button
                                size="small"
                                onClick={handleSubmitEmail}
                                disabled={loading}
                                sx={{ ml: 1, textTransform: "none", color: BRAND_COLOR }}
                            >
                                Resend
                            </Button>
                        </Typography>
                    </>
                )}

                {step === 3 && (
                    <>
                        <DialogContentText>Create a new password for your agent account.</DialogContentText>
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
                            error={passwordError}
                            helperText={passwordError ? passwordErrorMessage : "Password must be at least 8 characters"}
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
                            error={confirmPasswordError}
                            helperText={confirmPasswordErrorMessage}
                        />
                    </>
                )}

                {loading && (
                    <Stack alignItems="center" sx={{ my: 1 }}>
                        <CircularProgress size={24} sx={{ color: BRAND_COLOR }} />
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleCloseDialog} disabled={loading}>
                    Cancel
                </Button>
                {step === 1 && (
                    <PrimaryButton variant="contained" type="submit" onClick={handleSubmitEmail} disabled={loading || !email}>
                        Send OTP
                    </PrimaryButton>
                )}
                {step === 2 && (
                    <PrimaryButton
                        variant="contained"
                        type="submit"
                        onClick={handleVerifyOTP}
                        disabled={loading || !otp || otp.length < 6}
                    >
                        Verify OTP
                    </PrimaryButton>
                )}
                {step === 3 && (
                    <PrimaryButton
                        variant="contained"
                        type="submit"
                        onClick={handleResetPassword}
                        disabled={
                            loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8
                        }
                    >
                        Reset Password
                    </PrimaryButton>
                )}
            </DialogActions>
        </Dialog>
    )
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

export default ForgotPassword