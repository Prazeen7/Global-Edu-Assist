"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Chip,
    Tooltip,
    TextField,
    InputAdornment,
    MenuItem,
    Menu,
    Avatar,
    IconButton,
    Drawer,
    Button,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link as MuiLink,
    TablePagination,
} from "@mui/material"
import {
    Search,
    FilterList,
    Close,
    Business,
    Person,
    Email,
    Phone,
    Language,
    LocationOn,
    Description,
    Check,
} from "@mui/icons-material"
import PageHeader from "../../components/Admin/PageHeader"

function Agents() {
    const [agents, setAgents] = useState([])
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("companyName")
    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [agentDetailsLoading, setAgentDetailsLoading] = useState(false)
    const [agentDetailsError, setAgentDetailsError] = useState(null)
    const [isDisapproving, setIsDisapproving] = useState(false)
    const [disapprovalRemark, setDisapprovalRemark] = useState("")
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [statusUpdateError, setStatusUpdateError] = useState(null)
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false)
    const [statusFilter, setStatusFilter] = useState("all") // New state for status filtering

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("http://localhost:3001/api/getAgent")

            if (!response.data?.success || !Array.isArray(response.data.data)) {
                throw new Error("Invalid data format received from server")
            }

            const transformedAgents = response.data.data.map((agent) => {
                return {
                    id: agent._id,
                    companyName: agent.companyName || "Unknown Company",
                    email: agent.email || "",
                    website: agent.website || "",
                    contactNumber: agent.contactNumber || "",
                    location: agent.headOfficeAddress || "Location not specified",
                    branches: agent.branches?.length || 0,
                    status: agent.status || "pending",
                    profilePicture: agent.profilePicture?.url || "",
                    owners:
                        agent.owners
                            ?.map((owner) => owner?.name)
                            .filter(Boolean)
                            .join(", ") || "No owner specified",
                    initials: agent.companyName
                        ? agent.companyName
                            .split(" ")
                            .filter((word) => word.length > 0)
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)
                        : "UC",
                }
            })

            setAgents(transformedAgents)
        } catch (error) {
            console.error("Failed to load agents:", error)
            setError(error.response?.data?.message || error.message || "Could not load agent data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (statusUpdateSuccess || statusUpdateError) {
            const timer = setTimeout(() => {
                setStatusUpdateSuccess(false)
                setStatusUpdateError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [statusUpdateSuccess, statusUpdateError])

    // Reset to first page when search term or status filter changes
    useEffect(() => {
        setPage(0)
    }, [searchTerm, statusFilter])

    const fetchAgentDetails = async (agentId) => {
        try {
            setAgentDetailsLoading(true)
            setAgentDetailsError(null)
            const response = await axios.get(`http://localhost:3001/api/agent/${agentId}`)

            if (!response.data?.data) {
                throw new Error("Invalid data format received from server")
            }

            setSelectedAgent(response.data.data)
        } catch (error) {
            console.error("Failed to load agent details:", error)
            setAgentDetailsError(error.response?.data?.message || error.message || "Could not load agent details")
        } finally {
            setAgentDetailsLoading(false)
        }
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleFilterClose = () => {
        setAnchorEl(null)
    }

    // Handle status filter selection
    const handleStatusFilterSelect = (status) => {
        setStatusFilter(status)
        setAnchorEl(null)
    }

    const handleRowClick = async (agentId) => {
        await fetchAgentDetails(agentId)
        setDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setSelectedAgent(null)
        setIsDisapproving(false)
        setDisapprovalRemark("")
        setStatusUpdateSuccess(false)
        setStatusUpdateError(null)
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "success"
            case "active":
                return "success"
            case "rejected":
                return "error"
            case "inactive":
                return "default"
            case "pending":
                return "warning"
            default:
                return "default"
        }
    }

    // Apply both text search and status filtering
    const filteredAgents = agents.filter((agent) => {
        // Text search filter
        const matchesSearch =
            agent.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.owners.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter
        const matchesStatus = statusFilter === "all" || agent.status.toLowerCase() === statusFilter.toLowerCase()

        // Both conditions must be true
        return matchesSearch && matchesStatus
    })

    const sortedAgents = filteredAgents.sort((a, b) => {
        const isAsc = order === "asc"
        if (orderBy === "companyName") {
            return isAsc ? a.companyName.localeCompare(b.companyName) : b.companyName.localeCompare(a.companyName)
        } else if (orderBy === "location") {
            return isAsc ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location)
        } else if (orderBy === "branches") {
            return isAsc ? a.branches - b.branches : b.branches - a.branches
        } else if (orderBy === "status") {
            return isAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
        } else if (orderBy === "owners") {
            return isAsc ? a.owners.localeCompare(b.owners) : b.owners.localeCompare(a.owners)
        }
        return 0
    })

    // Calculate paginated agents based on current page and rows per page
    const paginatedAgents = sortedAgents.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

    const handlePageChange = (newPage) => {
        setPage(newPage)
    }

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10))
        setPage(0) // Reset to first page when changing rows per page
    }

    const handleApprove = async () => {
        if (!selectedAgent) return

        try {
            setIsUpdatingStatus(true)
            setStatusUpdateError(null)
            setStatusUpdateSuccess(false)

            // Fix: Update the API endpoint to include 'agent' in the path
            const response = await axios.put(`http://localhost:3001/api/agent/${selectedAgent._id}/status`, {
                status: "approved",
            })

            if (response.data?.success) {
                setSelectedAgent({
                    ...selectedAgent,
                    status: "approved",
                    remarks: undefined,
                })

                // Update the agent in the list
                setAgents(agents.map((agent) => (agent.id === selectedAgent._id ? { ...agent, status: "approved" } : agent)))

                setStatusUpdateSuccess(true)
            }
        } catch (error) {
            console.error("Failed to approve agent:", error)
            setStatusUpdateError(error.response?.data?.message || error.message || "Could not update agent status")
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleDisapprove = async () => {
        if (!selectedAgent || !disapprovalRemark.trim()) return

        try {
            setIsUpdatingStatus(true)
            setStatusUpdateError(null)
            setStatusUpdateSuccess(false)

            // Fix: Update the API endpoint to include 'agent' in the path
            const response = await axios.put(`http://localhost:3001/api/agent/${selectedAgent._id}/status`, {
                status: "rejected",
                remarks: disapprovalRemark,
            })

            if (response.data?.success) {
                setSelectedAgent({
                    ...selectedAgent,
                    status: "rejected",
                    remarks: disapprovalRemark,
                })

                // Update the agent in the list
                setAgents(agents.map((agent) => (agent.id === selectedAgent._id ? { ...agent, status: "rejected" } : agent)))

                setStatusUpdateSuccess(true)
                setIsDisapproving(false)
                setDisapprovalRemark("")
            }
        } catch (error) {
            console.error("Failed to reject agent:", error)
            setStatusUpdateError(error.response?.data?.message || error.message || "Could not update agent status")
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleCancelDisapprove = () => {
        setIsDisapproving(false)
        setDisapprovalRemark("")
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading agent data...</Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
                        <PageHeader
                            title="Agent Management"
                            subtitle="Manage educational agents in the system"
                        />

            <Paper sx={{ width: "100%", mt: 3 }}>
                <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                    <TextField
                        size="small"
                        placeholder="Search agents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: "100%", md: 300 } }}
                    />
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Status filter indicator */}
                    {statusFilter !== "all" && (
                        <Chip
                            label={`Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`}
                            color={getStatusColor(statusFilter)}
                            onDelete={() => setStatusFilter("all")}
                            sx={{ mr: 2 }}
                        />
                    )}

                    <Tooltip title="Filter list">
                        <IconButton onClick={handleFilterClick}>
                            <FilterList />
                        </IconButton>
                    </Tooltip>
                </Toolbar>

                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "companyName"}
                                        direction={orderBy === "companyName" ? order : "asc"}
                                        onClick={() => handleRequestSort("companyName")}
                                    >
                                        Company Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "owners"}
                                        direction={orderBy === "owners" ? order : "asc"}
                                        onClick={() => handleRequestSort("owners")}
                                    >
                                        Owner(s)
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "location"}
                                        direction={orderBy === "location" ? order : "asc"}
                                        onClick={() => handleRequestSort("location")}
                                    >
                                        Head Office
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel
                                        active={orderBy === "branches"}
                                        direction={orderBy === "branches" ? order : "asc"}
                                        onClick={() => handleRequestSort("branches")}
                                    >
                                        Branches
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "status"}
                                        direction={orderBy === "status" ? order : "asc"}
                                        onClick={() => handleRequestSort("status")}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedAgents.length > 0 ? (
                                paginatedAgents.map((agent) => (
                                    <TableRow
                                        hover
                                        key={agent.id}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            cursor: "pointer",
                                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                                        }}
                                        onClick={() => handleRowClick(agent.id)}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar
                                                    src={agent.profilePicture ? `http://localhost:3001${agent.profilePicture}` : ""}
                                                    alt={agent.companyName}
                                                    sx={{ mr: 2, width: 32, height: 32 }}
                                                >
                                                    {agent.initials}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2">{agent.companyName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {agent.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{agent.owners}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{agent.contactNumber}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {agent.website}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {agent.location}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">{agent.branches}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                                color={getStatusColor(agent.status)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: agent.status.toLowerCase() === "approved" ? "#4f46e5" : undefined,
                                                    color: agent.status.toLowerCase() === "approved" ? "white" : undefined,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" sx={{ py: 2 }}>
                                            No agents found matching your filters
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    component="div"
                    count={filteredAgents.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Paper>

            {/* Status filter menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                <MenuItem onClick={() => handleStatusFilterSelect("all")} selected={statusFilter === "all"}>
                    All Agents
                </MenuItem>
                <MenuItem onClick={() => handleStatusFilterSelect("approved")} selected={statusFilter === "approved"}>
                    Approved Only
                </MenuItem>
                <MenuItem onClick={() => handleStatusFilterSelect("pending")} selected={statusFilter === "pending"}>
                    Pending Only
                </MenuItem>
                <MenuItem onClick={() => handleStatusFilterSelect("rejected")} selected={statusFilter === "rejected"}>
                    Rejected Only
                </MenuItem>
            </Menu>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{
                    sx: { width: { xs: "100%", md: "70%", lg: "60%" } },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        <IconButton onClick={handleCloseDrawer}>
                            <Close />
                        </IconButton>
                    </Box>

                    {agentDetailsLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {agentDetailsError && (
                        <Box sx={{ p: 3 }}>
                            <Alert severity="error">{agentDetailsError}</Alert>
                        </Box>
                    )}

                    {selectedAgent && !agentDetailsLoading && !agentDetailsError && (
                        <>
                            <Breadcrumbs sx={{ mb: 3 }}>
                                <MuiLink
                                    component="button"
                                    underline="hover"
                                    color="inherit"
                                    onClick={handleCloseDrawer}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Agents
                                </MuiLink>
                                <Typography color="text.primary">{selectedAgent.companyName}</Typography>
                            </Breadcrumbs>

                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item>
                                        <Avatar
                                            src={
                                                selectedAgent.profilePicture
                                                    ? selectedAgent.profilePicture.url.startsWith("http")
                                                        ? selectedAgent.profilePicture.url
                                                        : `http://localhost:3001${selectedAgent.profilePicture.url}`
                                                    : ""
                                            }
                                            alt={selectedAgent.companyName}
                                            sx={{ width: 100, height: 100 }}
                                        >
                                            {selectedAgent.companyName
                                                ?.split(" ")
                                                .map((word) => word[0])
                                                .join("")
                                                .toUpperCase()
                                                .substring(0, 2)}
                                        </Avatar>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h4" gutterBottom>
                                            {selectedAgent.companyName}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Chip
                                                label={selectedAgent.status?.charAt(0).toUpperCase() + selectedAgent.status?.slice(1)}
                                                color={getStatusColor(selectedAgent.status)}
                                                sx={{
                                                    backgroundColor: selectedAgent.status?.toLowerCase() === "approved" ? "#4f46e5" : undefined,
                                                    color: selectedAgent.status?.toLowerCase() === "approved" ? "white" : undefined,
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Created: {new Date(selectedAgent.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: "100%" }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                                            <Business sx={{ mr: 1 }} /> Company Information
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <List disablePadding>
                                            <ListItem disablePadding sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary="Email"
                                                    secondary={
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Email fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                                                {selectedAgent.email || "No email"}
                                                            </Box>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem disablePadding sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary="Website"
                                                    secondary={
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Language fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                                                {selectedAgent.website || "No website"}
                                                            </Box>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem disablePadding sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary="Contact Number"
                                                    secondary={
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Phone fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                                                {selectedAgent.contactNumber || "No contact number"}
                                                            </Box>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem disablePadding sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary="Head Office Address"
                                                    secondary={
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                                                <LocationOn fontSize="small" sx={{ mr: 1, mt: 0.5, color: "text.secondary" }} />
                                                                {selectedAgent.headOfficeAddress || "No address provided"}
                                                            </Box>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: "100%" }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                                            <Person sx={{ mr: 1 }} /> Owners
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        {selectedAgent.owners?.length > 0 ? (
                                            <List disablePadding>
                                                {selectedAgent.owners.map((owner) => (
                                                    <ListItem key={owner._id} disablePadding sx={{ py: 1 }}>
                                                        <ListItemText
                                                            primary={owner.name}
                                                            secondary={
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    {owner.email || "No email"}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography color="text.secondary">No owners listed</Typography>
                                        )}

                                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                                            <Business sx={{ mr: 1 }} /> Branches
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        {selectedAgent.branches?.length > 0 ? (
                                            <List disablePadding>
                                                {selectedAgent.branches.map((branch, index) => (
                                                    <ListItem key={branch._id || index} disablePadding sx={{ py: 1 }}>
                                                        <ListItemText
                                                            primary={`Branch ${index + 1}`}
                                                            secondary={
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    {branch.address || "No address provided"}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography color="text.secondary">No branches listed</Typography>
                                        )}
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                                            <Description sx={{ mr: 1 }} /> Documents
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />

                                        {selectedAgent.documents ? (
                                            <Grid container spacing={3}>
                                                {Object.entries(selectedAgent.documents).map(([key, doc]) => (
                                                    <Grid item xs={12} sm={6} md={3} key={key}>
                                                        <Card>
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={doc.url.startsWith("http") ? doc.url : `http://localhost:3001${doc.url}`}
                                                                alt={key}
                                                                sx={{ objectFit: "contain", bgcolor: "rgba(0,0,0,0.04)" }}
                                                            />
                                                            <CardContent>
                                                                <Typography variant="subtitle1">
                                                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {doc.filename}
                                                                </Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{ mt: 1 }}
                                                                    href={doc.url.startsWith("http") ? doc.url : `http://localhost:3001${doc.url}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    View Document
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography color="text.secondary">No documents available</Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Action buttons moved to bottom */}
                            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                {statusUpdateSuccess && (
                                    <Alert severity="success" sx={{ flexGrow: 1 }}>
                                        Agent status updated successfully
                                    </Alert>
                                )}

                                {statusUpdateError && (
                                    <Alert severity="error" sx={{ flexGrow: 1 }}>
                                        {statusUpdateError}
                                    </Alert>
                                )}
                            </Box>

                            {/* Remarks section moved to bottom */}
                            {selectedAgent.status === "rejected" && selectedAgent.remarks && (
                                <Box sx={{ mt: 3 }}>
                                    <Paper sx={{ p: 3, bgcolor: "#FEF2F2" }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ color: "#B91C1C", display: "flex", alignItems: "center" }}
                                        >
                                            <Close sx={{ mr: 1 }} /> Disapproval Reason
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography>{selectedAgent.remarks}</Typography>
                                    </Paper>
                                </Box>
                            )}

                            {/* Approval/Disapproval actions */}
                            {selectedAgent.status === "pending" && (
                                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                    {isDisapproving ? (
                                        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
                                            <TextField
                                                label="Disapproval Reason"
                                                multiline
                                                rows={3}
                                                value={disapprovalRemark}
                                                onChange={(e) => setDisapprovalRemark(e.target.value)}
                                                fullWidth
                                                required
                                                error={disapprovalRemark.trim() === ""}
                                                helperText={disapprovalRemark.trim() === "" ? "Reason is required" : ""}
                                            />
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                                <Button variant="outlined" onClick={handleCancelDisapprove} disabled={isUpdatingStatus}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={handleDisapprove}
                                                    disabled={isUpdatingStatus || disapprovalRemark.trim() === ""}
                                                >
                                                    {isUpdatingStatus ? <CircularProgress size={24} /> : "Confirm Disapproval"}
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => setIsDisapproving(true)}
                                                disabled={isUpdatingStatus || selectedAgent.status === "rejected"}
                                                startIcon={<Close />}
                                            >
                                                Disapprove
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleApprove}
                                                disabled={isUpdatingStatus || selectedAgent.status === "approved"}
                                                startIcon={<Check />}
                                                sx={{ bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" } }}
                                            >
                                                Approve
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Drawer>
        </Box>
    )
}

export default Agents
