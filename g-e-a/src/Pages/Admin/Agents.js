import { useState } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Menu from "@mui/material/Menu"
import Avatar from "@mui/material/Avatar"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PageHeader from "../../components/Admin/PageHeader"

const agents = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        country: "United States",
        students: 24,
        institutions: 5,
        status: "Active",
        avatar: "/placeholder-user.jpg",
        initials: "JD",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        country: "United Kingdom",
        students: 18,
        institutions: 3,
        status: "Active",
        avatar: "/placeholder-user.jpg",
        initials: "SJ",
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        country: "Canada",
        students: 15,
        institutions: 4,
        status: "Active",
        avatar: "/placeholder-user.jpg",
        initials: "MB",
    },
    {
        id: 4,
        name: "Emily Wilson",
        email: "emily.wilson@example.com",
        country: "Australia",
        students: 12,
        institutions: 2,
        status: "Inactive",
        avatar: "/placeholder-user.jpg",
        initials: "EW",
    },
    {
        id: 5,
        name: "David Lee",
        email: "david.lee@example.com",
        country: "Singapore",
        students: 9,
        institutions: 3,
        status: "Active",
        avatar: "/placeholder-user.jpg",
        initials: "DL",
    },
    {
        id: 6,
        name: "Jessica Martinez",
        email: "jessica.martinez@example.com",
        country: "Spain",
        students: 7,
        institutions: 2,
        status: "Pending",
        avatar: "/placeholder-user.jpg",
        initials: "JM",
    },
]

function Agents() {
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("name")
    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [anchorEl, setAnchorEl] = useState(null)
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null)
    const [selectedAgent, setSelectedAgent] = useState(null)

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

    const handleActionClick = (event, agent) => {
        setActionMenuAnchorEl(event.currentTarget)
        setSelectedAgent(agent)
    }

    const handleActionClose = () => {
        setActionMenuAnchorEl(null)
        setSelectedAgent(null)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "success"
            case "Inactive":
                return "default"
            case "Pending":
                return "warning"
            default:
                return "default"
        }
    }

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
                            onChange={(e) => setRowsPerPage(e.target.value)}
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
                                        active={orderBy === "students"}
                                        direction={orderBy === "students" ? order : "asc"}
                                        onClick={() => handleRequestSort("students")}
                                    >
                                        Students
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
                            {agents.map((agent) => (
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
                                    <TableCell align="right">{agent.students}</TableCell>
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
                <MenuItem onClick={handleActionClose}>View profile</MenuItem>
                <MenuItem onClick={handleActionClose}>Edit</MenuItem>
                <MenuItem onClick={handleActionClose}>View students</MenuItem>
                <MenuItem onClick={handleActionClose}>
                    {selectedAgent?.status === "Active" ? "Deactivate" : "Activate"}
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default Agents

