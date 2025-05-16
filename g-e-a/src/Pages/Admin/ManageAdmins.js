"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Stack,
    InputAdornment,
    IconButton,
} from "@mui/material"
import { Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material"
import axiosInstance from "../../utils/axiosConfig" // Import the configured axios instance
import { useNavigate } from "react-router-dom"
import parseJwt from "../../utils/parseJwt"

// Password regex: at least 8 chars, 1 uppercase, 1 special char
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/

function ManageAdmins() {
    const navigate = useNavigate()
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [newAdmin, setNewAdmin] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        superAdmin: false,
    })
    const [editAdmin, setEditAdmin] = useState({
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        superAdmin: false,
        changePassword: false,
    })
    const [formErrors, setFormErrors] = useState({})
    const [editFormErrors, setEditFormErrors] = useState({})
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    })

    // Check if user is super admin
    useEffect(() => {
        const token = localStorage.getItem("auth") || localStorage.getItem("token")
        if (token) {
            const decodedToken = parseJwt(token)
            if (!decodedToken || decodedToken.superAdmin !== true) {
                // Redirect non-super admins away from this page
                showSnackbar("You don't have permission to access this page", "error")
                navigate("/admin/dashboard")
                return
            }
        } else {
            // No token, redirect to login
            navigate("/admin")
            return
        }

        // If we get here, user is a super admin, so fetch admins
        fetchAdmins()
    }, [navigate])

    // Fetch all admins
    const fetchAdmins = async () => {
        try {
            setLoading(true)
            console.log("Fetching admins from backend...")

            // Use the axios instance with the correct baseURL
            const response = await axiosInstance.get("/admin/admins")

            console.log("Admins data received:", response.data)
            setAdmins(response.data)
            setError(null)
        } catch (err) {
            console.error("Error fetching admins:", err)

            if (err.response?.status === 403) {
                // Permission denied
                showSnackbar("You don't have permission to access admin management", "error")
                navigate("/admin/dashboard")
                return
            }

            setError(err.response?.data?.message || "Failed to fetch admins")
            showSnackbar("Failed to fetch admins", "error")
        } finally {
            setLoading(false)
        }
    }

    const validatePassword = (password) => {
        if (!password) return "Password is required"
        if (!PASSWORD_REGEX.test(password)) {
            return "Password must be at least 8 characters with 1 uppercase letter and 1 special character (!@#$%^&*)"
        }
        return ""
    }

    const validateForm = () => {
        const errors = {}

        if (!newAdmin.firstName.trim()) errors.firstName = "First name is required"
        if (!newAdmin.lastName.trim()) errors.lastName = "Last name is required"

        if (!newAdmin.email.trim()) {
            errors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
            errors.email = "Email is invalid"
        }

        const passwordError = validatePassword(newAdmin.password)
        if (passwordError) errors.password = passwordError

        if (newAdmin.password !== newAdmin.confirmPassword) {
            errors.confirmPassword = "Passwords do not match"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateEditForm = () => {
        const errors = {}

        if (!editAdmin.firstName.trim()) errors.firstName = "First name is required"
        if (!editAdmin.lastName.trim()) errors.lastName = "Last name is required"

        if (!editAdmin.email.trim()) {
            errors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(editAdmin.email)) {
            errors.email = "Email is invalid"
        }

        if (editAdmin.changePassword) {
            const passwordError = validatePassword(editAdmin.password)
            if (passwordError) errors.password = passwordError

            if (editAdmin.password !== editAdmin.confirmPassword) {
                errors.confirmPassword = "Passwords do not match"
            }
        }

        setEditFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleAddAdmin = async () => {
        if (!validateForm()) return

        try {
            // Use the axios instance with the correct baseURL
            const response = await axiosInstance.post("/admin/admins", {
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                password: newAdmin.password,
                superAdmin: newAdmin.superAdmin,
            })

            setOpenAddDialog(false)
            showSnackbar("Admin added successfully", "success")

            // Reset form
            setNewAdmin({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                superAdmin: false,
            })

            fetchAdmins()
        } catch (err) {
            if (err.response?.status === 403) {
                showSnackbar("You don't have permission to add admins", "error")
            } else {
                showSnackbar(err.response?.data?.message || "Failed to add admin", "error")
            }
        }
    }

    const handleEditAdmin = async () => {
        if (!validateEditForm()) return

        try {
            // Prepare update data
            const updateData = {
                firstName: editAdmin.firstName,
                lastName: editAdmin.lastName,
                email: editAdmin.email,
                superAdmin: editAdmin.superAdmin,
            }

            // Only include password if changePassword is true
            if (editAdmin.changePassword) {
                updateData.password = editAdmin.password
            }

            // Use the axios instance with the correct baseURL
            const response = await axiosInstance.put(`/admin/admins/${editAdmin._id}`, updateData)

            setOpenEditDialog(false)
            showSnackbar("Admin updated successfully", "success")
            fetchAdmins()
        } catch (err) {
            if (err.response?.status === 403) {
                showSnackbar("You don't have permission to edit admins", "error")
            } else {
                showSnackbar(err.response?.data?.message || "Failed to update admin", "error")
            }
        }
    }

    const handleDeleteAdmin = async () => {
        try {
            // Use the axios instance with the correct baseURL
            const response = await axiosInstance.delete(`/admin/admins/${selectedAdmin._id}`)

            setOpenDeleteDialog(false)
            showSnackbar("Admin removed successfully", "success")
            fetchAdmins()
        } catch (err) {
            if (err.response?.status === 403) {
                showSnackbar("You don't have permission to remove admins", "error")
            } else {
                showSnackbar(err.response?.data?.message || "Failed to remove admin", "error")
            }
        }
    }

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        })
    }

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false,
        })
    }

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target
        setNewAdmin({
            ...newAdmin,
            [name]: type === "checkbox" ? checked : value,
        })

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: "",
            })
        }
    }

    const handleEditInputChange = (e) => {
        const { name, value, checked, type } = e.target
        setEditAdmin({
            ...editAdmin,
            [name]: type === "checkbox" ? checked : value,
        })

        // Clear error when user types
        if (editFormErrors[name]) {
            setEditFormErrors({
                ...editFormErrors,
                [name]: "",
            })
        }
    }

    const handleOpenEditDialog = (admin) => {
        setEditAdmin({
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: "",
            confirmPassword: "",
            superAdmin: admin.superAdmin || false,
            changePassword: false,
        })
        setEditFormErrors({})
        setOpenEditDialog(true)
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Manage Admins
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
                    Add New Admin
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.length > 0 ? (
                                admins.map((admin) => (
                                    <TableRow key={admin._id}>
                                        <TableCell>{`${admin.firstName} ${admin.lastName}`}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.superAdmin ? "Super Admin" : "Admin"}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleOpenEditDialog(admin)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<Delete />}
                                                    onClick={() => {
                                                        setSelectedAdmin(admin)
                                                        setOpenDeleteDialog(true)
                                                    }}
                                                    disabled={admin.superAdmin} // Prevent deleting super admins
                                                >
                                                    Remove
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No admins found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Add Admin Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        value={newAdmin.firstName}
                        onChange={handleInputChange}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        value={newAdmin.lastName}
                        onChange={handleInputChange}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newAdmin.email}
                        onChange={handleInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={newAdmin.password}
                        onChange={handleInputChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ mt: 1, mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Password must contain at least 8 characters, 1 uppercase letter, and 1 special character (!@#$%^&*)
                        </Typography>
                    </Box>
                    <TextField
                        margin="dense"
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        value={newAdmin.confirmPassword}
                        onChange={handleInputChange}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowConfirmPassword} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox name="superAdmin" checked={newAdmin.superAdmin} onChange={handleInputChange} />}
                        label="Make this admin a Super Admin"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddAdmin} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Admin Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Admin</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        value={editAdmin.firstName}
                        onChange={handleEditInputChange}
                        error={!!editFormErrors.firstName}
                        helperText={editFormErrors.firstName}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        value={editAdmin.lastName}
                        onChange={handleEditInputChange}
                        error={!!editFormErrors.lastName}
                        helperText={editFormErrors.lastName}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editAdmin.email}
                        onChange={handleEditInputChange}
                        error={!!editFormErrors.email}
                        helperText={editFormErrors.email}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox name="changePassword" checked={editAdmin.changePassword} onChange={handleEditInputChange} />
                        }
                        label="Change Password"
                        sx={{ mt: 2, mb: 1 }}
                    />

                    {editAdmin.changePassword && (
                        <>
                            <TextField
                                margin="dense"
                                name="password"
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                value={editAdmin.password}
                                onChange={handleEditInputChange}
                                error={!!editFormErrors.password}
                                helperText={editFormErrors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Password must contain at least 8 characters, 1 uppercase letter, and 1 special character (!@#$%^&*)
                                </Typography>
                            </Box>
                            <TextField
                                margin="dense"
                                name="confirmPassword"
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                fullWidth
                                value={editAdmin.confirmPassword}
                                onChange={handleEditInputChange}
                                error={!!editFormErrors.confirmPassword}
                                helperText={editFormErrors.confirmPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowConfirmPassword} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </>
                    )}

                    <FormControlLabel
                        control={<Checkbox name="superAdmin" checked={editAdmin.superAdmin} onChange={handleEditInputChange} />}
                        label="Super Admin"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditAdmin} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Admin Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Remove Admin</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove {selectedAdmin?.firstName} {selectedAdmin?.lastName}? This action cannot be
                        undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteAdmin} color="error">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default ManageAdmins
