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
import DescriptionIcon from "@mui/icons-material/Description"
import PageHeader from "../../components/Admin/PageHeader"

const documents = [
    {
        id: 1,
        name: "Student Visa Application",
        type: "Visa",
        student: "John Smith",
        institution: "University of Technology",
        submitted: "2023-06-15",
        status: "Approved",
    },
    {
        id: 2,
        name: "Scholarship Application",
        type: "Financial",
        student: "Emily Johnson",
        institution: "Global Business School",
        submitted: "2023-06-18",
        status: "Pending",
    },
    {
        id: 3,
        name: "Admission Letter",
        type: "Academic",
        student: "Michael Brown",
        institution: "Medical Sciences Academy",
        submitted: "2023-06-20",
        status: "Approved",
    },
    {
        id: 4,
        name: "Transcript",
        type: "Academic",
        student: "Sarah Wilson",
        institution: "Engineering Institute",
        submitted: "2023-06-22",
        status: "Pending",
    },
    {
        id: 5,
        name: "Financial Statement",
        type: "Financial",
        student: "David Lee",
        institution: "Arts and Design College",
        submitted: "2023-06-25",
        status: "Rejected",
    },
    {
        id: 6,
        name: "Health Insurance",
        type: "Insurance",
        student: "Jessica Martinez",
        institution: "International Law School",
        submitted: "2023-06-28",
        status: "Approved",
    },
    {
        id: 7,
        name: "Accommodation Request",
        type: "Housing",
        student: "Robert Taylor",
        institution: "Hospitality Management Institute",
        submitted: "2023-06-30",
        status: "Pending",
    },
]

function Documents() {
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("name")
    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [anchorEl, setAnchorEl] = useState(null)
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null)
    const [selectedDocument, setSelectedDocument] = useState(null)

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

    const handleActionClick = (event, document) => {
        setActionMenuAnchorEl(event.currentTarget)
        setSelectedDocument(document)
    }

    const handleActionClose = () => {
        setActionMenuAnchorEl(null)
        setSelectedDocument(null)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "success"
            case "Pending":
                return "warning"
            case "Rejected":
                return "error"
            default:
                return "default"
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Documents Management"
                subtitle="Manage and process documents in the system"
                action={true}
                actionIcon={<AddIcon />}
                actionText="Add Document"
            />

            <Paper sx={{ width: "100%", mt: 3 }}>
                <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                    <TextField
                        size="small"
                        placeholder="Search documents..."
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
                                        Document Name
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
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "student"}
                                        direction={orderBy === "student" ? order : "asc"}
                                        onClick={() => handleRequestSort("student")}
                                    >
                                        Student
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "institution"}
                                        direction={orderBy === "institution" ? order : "asc"}
                                        onClick={() => handleRequestSort("institution")}
                                    >
                                        Institution
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "submitted"}
                                        direction={orderBy === "submitted" ? order : "asc"}
                                        onClick={() => handleRequestSort("submitted")}
                                    >
                                        Submitted
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
                            {documents.map((document) => (
                                <TableRow hover key={document.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <DescriptionIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                            {document.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{document.type}</TableCell>
                                    <TableCell>{document.student}</TableCell>
                                    <TableCell>{document.institution}</TableCell>
                                    <TableCell>{document.submitted}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={document.status}
                                            color={getStatusColor(document.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: document.status === "Approved" ? "#4f46e5" : undefined,
                                                color: document.status === "Approved" ? "white" : undefined,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(event) => handleActionClick(event, document)}>
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
                <MenuItem onClick={handleFilterClose}>All Documents</MenuItem>
                <MenuItem onClick={handleFilterClose}>Approved Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Pending Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Rejected Only</MenuItem>
            </Menu>

            {/* Action Menu */}
            <Menu anchorEl={actionMenuAnchorEl} open={Boolean(actionMenuAnchorEl)} onClose={handleActionClose}>
                <MenuItem onClick={handleActionClose}>View document</MenuItem>
                <MenuItem onClick={handleActionClose}>Download</MenuItem>
                <MenuItem onClick={handleActionClose}>Approve</MenuItem>
                <MenuItem onClick={handleActionClose}>Reject</MenuItem>
                <MenuItem onClick={handleActionClose}>Request changes</MenuItem>
            </Menu>
        </Box>
    )
}

export default Documents

