import { useState, useEffect } from "react";
import axios from "axios";
// Material-UI components imports
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, Toolbar, Typography,
    Chip, IconButton, Tooltip, TextField, InputAdornment,
    MenuItem, Select, FormControl, InputLabel, Menu, Avatar,
    Pagination
} from "@mui/material";
// Icons imports
import { Add, Search, FilterList, MoreVert } from "@mui/icons-material";
import PageHeader from "../../components/Admin/PageHeader";

function Agents() {
    // State management for agents data and UI controls
    const [agents, setAgents] = useState([]); 
    const [order, setOrder] = useState("asc"); 
    const [orderBy, setOrderBy] = useState("name"); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const [page, setPage] = useState(0); 
    const [anchorEl, setAnchorEl] = useState(null); 
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null); 
    const [selectedAgent, setSelectedAgent] = useState(null); 
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 

    // Fetch agents data
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("http://localhost:3001/api/agents");

                // Validate response data structure
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error("Invalid data format received from server");
                }

                const transformedAgents = response.data.map((doc) => {
                    // Extract agent name 
                    const agentName = Object.keys(doc).find(key => key !== "_id" && key !== "__v");

                    // Skip invalid documents missing required fields
                    if (!agentName || !doc[agentName]?.head_office) {
                        console.warn("Skipping invalid agent document:", doc);
                        return null;
                    }

                    const agentData = doc[agentName];
                    return {
                        id: doc._id, 
                        name: agentName,
                        email: agentData.head_office.email || "No email",
                        country: agentData.head_office.location || "Unknown",
                        institutions: agentData.other_locations?.length || 0, 
                        status: "Active", 
                        avatar: agentData.head_office.avatar || "",
                        initials: agentName 
                            .split(" ")
                            .map(word => word[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)
                    };
                }).filter(agent => agent !== null); // Remove any null entries

                setAgents(transformedAgents);
            } catch (error) {
                console.error("Failed to load agents:", error);
                setError(error.response?.data?.message || error.message || "Could not load agent data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgents();
    }, []);

    // Handle sorting column changes
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // Filter menu handlers
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    // Action menu handlers
    const handleActionClick = (event, agent) => {
        setActionMenuAnchorEl(event.currentTarget);
        setSelectedAgent(agent);
    };

    const handleActionClose = () => {
        setActionMenuAnchorEl(null);
        setSelectedAgent(null);
    };

    // Determine color for status chips
    const getStatusColor = (status) => {
        switch (status) {
            case "Active": return "success";
            case "Inactive": return "default";
            case "Pending": return "warning";
            default: return "default";
        }
    };

    // Action handlers for agent operations
    const handleViewProfile = () => {
        console.log("Viewing profile:", selectedAgent);
        handleActionClose();
    };

    const handleEdit = () => {
        console.log("Editing:", selectedAgent);
        handleActionClose();
    };

    const handleViewStudents = () => {
        console.log("Viewing students:", selectedAgent);
        handleActionClose();
    };

    const handleToggleStatus = () => {
        console.log("Toggling status:", selectedAgent);
        handleActionClose();
    };

    // Filter agents based on search term (name, email, or country)
    const filteredAgents = agents.filter((agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort agents based on current sort column and direction
    const sortedAgents = filteredAgents.sort((a, b) => {
        const isAsc = order === "asc";
        if (orderBy === "name") {
            return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (orderBy === "country") {
            return isAsc ? a.country.localeCompare(b.country) : b.country.localeCompare(a.country);
        } else if (orderBy === "institutions") {
            return isAsc ? a.institutions - b.institutions : b.institutions - a.institutions;
        } else if (orderBy === "status") {
            return isAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        }
        return 0;
    });

    // Paginate the sorted agents list
    const paginatedAgents = sortedAgents.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    // Loading state UI
    if (isLoading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <Typography>Loading agent data...</Typography>
            </Box>
        );
    }

    // Error state UI
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Main component render
    return (
        <Box sx={{ p: 3 }}>
            {/* Page header with title and add button */}
            <PageHeader
                title="Agent Management"
                subtitle="Manage educational agents in the system"
                action={true}
                actionIcon={<Add />}
                actionText="Add Agent"
            />

            {/* Main table container */}
            <Paper sx={{ width: "100%", mt: 3 }}>
                {/* Toolbar with search and pagination controls */}
                <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                    {/* Search input field */}
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
                    {/* Filter button */}
                    <Tooltip title="Filter list">
                        <IconButton onClick={handleFilterClick}>
                            <FilterList />
                        </IconButton>
                    </Tooltip>
                    {/* Rows per page selector */}
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="rows-per-page-label">Per Page</InputLabel>
                        <Select
                            labelId="rows-per-page-label"
                            id="rows-per-page"
                            value={rowsPerPage}
                            label="Per Page"
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                </Toolbar>

                {/* Agents table */}
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                {/* Sortable table headers */}
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "name"}
                                        direction={orderBy === "name" ? order : "asc"}
                                        onClick={() => handleRequestSort("name")}
                                    >
                                        Agent Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "country"}
                                        direction={orderBy === "country" ? order : "asc"}
                                        onClick={() => handleRequestSort("country")}
                                    >
                                        Country
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel
                                        active={orderBy === "institutions"}
                                        direction={orderBy === "institutions" ? order : "asc"}
                                        onClick={() => handleRequestSort("institutions")}
                                    >
                                        Offices
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
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Render each agent row */}
                            {paginatedAgents.map((agent) => (
                                <TableRow hover key={agent.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {/* Agent avatar with fallback to initials */}
                                            <Avatar src={agent.avatar} alt={agent.name} sx={{ mr: 2, width: 32, height: 32 }}>
                                                {agent.initials}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2">{agent.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {agent.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{agent.country}</TableCell>
                                    <TableCell align="right">{agent.institutions}</TableCell>
                                    <TableCell>
                                        {/* Status indicator chip */}
                                        <Chip
                                            label={agent.status}
                                            color={getStatusColor(agent.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: agent.status === "Active" ? "#4f46e5" : undefined,
                                                color: agent.status === "Active" ? "white" : undefined,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* Action menu trigger */}
                                        <IconButton size="small" onClick={(event) => handleActionClick(event, agent)}>
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination controls */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, p: 2 }}>
                    <Pagination
                        count={Math.ceil(sortedAgents.length / rowsPerPage)}
                        page={page + 1}
                        onChange={(event, value) => setPage(value - 1)}
                        color="primary"
                    />
                </Box>
            </Paper>

            {/* Filter dropdown menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                <MenuItem onClick={handleFilterClose}>All Agents</MenuItem>
                <MenuItem onClick={handleFilterClose}>Active Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Inactive Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Pending Approval</MenuItem>
            </Menu>

            {/* Action dropdown menu */}
            <Menu
                anchorEl={actionMenuAnchorEl}
                open={Boolean(actionMenuAnchorEl)}
                onClose={handleActionClose}
            >
                <MenuItem onClick={handleViewProfile}>View profile</MenuItem>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleViewStudents}>View students</MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    {selectedAgent?.status === "Active" ? "Deactivate" : "Activate"}
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default Agents;