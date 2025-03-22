import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Pagination from "@mui/material/Pagination";
import PageHeader from "../../components/Admin/PageHeader";

function Agents() {
    // State variables
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

    // Fetch agents from the backend
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/agents");
                const agentDocuments = response.data;

                // Transform the data to match the frontend structure
                const transformedAgents = agentDocuments.map((doc) => {
                    // Extract the agent name (e.g., "AECC Global")
                    const agentName = Object.keys(doc).find((key) => key !== "_id");

                    // Get the agent data nested under the agentName key
                    const agentData = doc[agentName];

                    return {
                        id: doc._id, // Use MongoDB's _id as the unique identifier
                        name: agentName,
                        email: agentData.head_office.email,
                        country: agentData.head_office.location,
                        institutions: agentData.other_locations.length,
                        status: "Active", // Default status
                        avatar: agentData.head_office.avatar,
                        initials: agentName
                            .split(" ")
                            .map((word) => word[0])
                            .join(""),
                    };
                });

                setAgents(transformedAgents);
            } catch (error) {
                console.error("Error fetching agents:", error);
                setError("Failed to fetch agents. Please try again later.");
            }
        };

        fetchAgents();
    }, []);

    // Sorting logic
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // Filter menu logic
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    // Action menu logic
    const handleActionClick = (event, agent) => {
        setActionMenuAnchorEl(event.currentTarget);
        setSelectedAgent(agent);
    };

    const handleActionClose = () => {
        setActionMenuAnchorEl(null);
        setSelectedAgent(null);
    };

    // Get status color for chips
    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "success";
            case "Inactive":
                return "default";
            case "Pending":
                return "warning";
            default:
                return "default";
        }
    };

    // Action handlers
    const handleViewProfile = () => {
        console.log("View profile:", selectedAgent);
        handleActionClose();
    };

    const handleEdit = () => {
        console.log("Edit:", selectedAgent);
        handleActionClose();
    };

    const handleViewStudents = () => {
        console.log("View students:", selectedAgent);
        handleActionClose();
    };

    const handleToggleStatus = () => {
        console.log("Toggle status:", selectedAgent);
        handleActionClose();
    };

    // Filter agents based on search term
    const filteredAgents = agents.filter((agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort agents
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

    // Paginate agents
    const paginatedAgents = sortedAgents.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Agent Management"
                subtitle="Manage educational agents in the system"
                action={true}
                actionIcon={<AddIcon />}
                actionText="Add Agent"
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
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: "100%", md: 300 } }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Filter list">
                        <IconButton onClick={handleFilterClick}>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
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
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
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
                                        Institutions
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
                            {paginatedAgents.map((agent) => (
                                <TableRow hover key={agent.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                        <IconButton size="small" onClick={(event) => handleActionClick(event, agent)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={Math.ceil(sortedAgents.length / rowsPerPage)}
                        page={page + 1}
                        onChange={(event, value) => setPage(value - 1)}
                    />
                </Box>
            </Paper>

            {/* Filter Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                <MenuItem onClick={handleFilterClose}>All Agents</MenuItem>
                <MenuItem onClick={handleFilterClose}>Active Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Inactive Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Pending Approval</MenuItem>
            </Menu>

            {/* Action Menu */}
            <Menu anchorEl={actionMenuAnchorEl} open={Boolean(actionMenuAnchorEl)} onClose={handleActionClose}>
                <MenuItem onClick={handleViewProfile}>View profile</MenuItem>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleViewStudents}>View students</MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    {selectedAgent?.status === "Active" ? "Deactivate" : "Activate"}
                </MenuItem>
            </Menu>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}

export default Agents;