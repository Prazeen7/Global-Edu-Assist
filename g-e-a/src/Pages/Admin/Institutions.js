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
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PageHeader from "../../components/Admin/PageHeader"

const institutions = [
    {
        id: 1,
        name: "University of Technology",
        country: "United States",
        type: "University",
        programs: 45,
        status: "Active",
    },
    {
        id: 2,
        name: "Global Business School",
        country: "United Kingdom",
        type: "Business School",
        programs: 23,
        status: "Active",
    },
    {
        id: 3,
        name: "Medical Sciences Academy",
        country: "Canada",
        type: "Medical School",
        programs: 18,
        status: "Active",
    },
    {
        id: 4,
        name: "Engineering Institute",
        country: "Australia",
        type: "Technical Institute",
        programs: 32,
        status: "Inactive",
    },
    {
        id: 5,
        name: "Arts and Design College",
        country: "France",
        type: "Arts College",
        programs: 15,
        status: "Active",
    },
    {
        id: 6,
        name: "International Law School",
        country: "Germany",
        type: "Law School",
        programs: 12,
        status: "Pending",
    },
    {
        id: 7,
        name: "Hospitality Management Institute",
        country: "Switzerland",
        type: "Vocational Institute",
        programs: 8,
        status: "Active",
    },
    {
        id: 8,
        name: "Digital Technology University",
        country: "Singapore",
        type: "University",
        programs: 27,
        status: "Active",
    },
]

function Institutions() {
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("name")
    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [anchorEl, setAnchorEl] = useState(null)
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null)
    const [selectedInstitution, setSelectedInstitution] = useState(null)

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

    const handleActionClick = (event, institution) => {
        setActionMenuAnchorEl(event.currentTarget)
        setSelectedInstitution(institution)
    }

    const handleActionClose = () => {
        setActionMenuAnchorEl(null)
        setSelectedInstitution(null)
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
                title="Institution Management"
                subtitle="Manage educational institutions in the system"
                action={true}
                actionIcon={<AddIcon />}
                actionText="Add Institution"
            />

            <Paper sx={{ width: "100%", mt: 3 }}>
                <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                    <TextField
                        size="small"
                        placeholder="Search institutions..."
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
                                        Institution Name
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
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "type"}
                                        direction={orderBy === "type" ? order : "asc"}
                                        onClick={() => handleRequestSort("type")}
                                    >
                                        Type
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel
                                        active={orderBy === "programs"}
                                        direction={orderBy === "programs" ? order : "asc"}
                                        onClick={() => handleRequestSort("programs")}
                                    >
                                        Programs
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
                            {institutions.map((institution) => (
                                <TableRow hover key={institution.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {institution.name}
                                    </TableCell>
                                    <TableCell>{institution.country}</TableCell>
                                    <TableCell>{institution.type}</TableCell>
                                    <TableCell align="right">{institution.programs}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={institution.status}
                                            color={getStatusColor(institution.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: institution.status === "Active" ? "#4f46e5" : undefined,
                                                color: institution.status === "Active" ? "white" : undefined,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(event) => handleActionClick(event, institution)}>
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
                <MenuItem onClick={handleFilterClose}>All Institutions</MenuItem>
                <MenuItem onClick={handleFilterClose}>Active Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Inactive Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Pending Approval</MenuItem>
            </Menu>

            {/* Action Menu */}
            <Menu anchorEl={actionMenuAnchorEl} open={Boolean(actionMenuAnchorEl)} onClose={handleActionClose}>
                <MenuItem onClick={handleActionClose}>View details</MenuItem>
                <MenuItem onClick={handleActionClose}>Edit</MenuItem>
                <MenuItem onClick={handleActionClose}>Manage programs</MenuItem>
                <MenuItem onClick={handleActionClose}>
                    {selectedInstitution?.status === "Active" ? "Deactivate" : "Activate"}
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default Institutions

