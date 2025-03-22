import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    Chip,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Menu,
} from "@mui/material";
import { Add, Search, FilterList, MoreVert, ArrowBack } from "@mui/icons-material";
import PageHeader from "../../components/Admin/PageHeader";
import AddInstitution from "../../components/Admin/AddInstitutions";

function AdminInstitutions() {
    const [institutions, setInstitutions] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [showAddInstitution, setShowAddInstitution] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInstitutions();
    }, [searchTerm]);

    const fetchInstitutions = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/institutions");
            setInstitutions(response.data);
        } catch (error) {
            console.error("Error fetching institutions:", error);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleActionClick = (event, institution) => {
        setActionMenuAnchorEl(event.currentTarget);
        setSelectedInstitution(institution);
    };

    const handleActionClose = (action) => {
        if (action === "View details" && selectedInstitution) {
            navigate(`/admin/institutionPage/${selectedInstitution._id}`, {
                state: selectedInstitution,
            });
        }
        setActionMenuAnchorEl(null);
        setSelectedInstitution(null);
    };

    const handleAddInstitutionClick = () => {
        setShowAddInstitution(true);
    };

    const handleBackToInstitutions = () => {
        setShowAddInstitution(false);
        fetchInstitutions(); // Refresh the list after adding a new institution
    };

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

    // Filter institutions based on search term
    const filteredInstitutions = institutions.filter((institution) =>
        institution.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3 }}>
            {showAddInstitution ? (
                <AddInstitution onClose={handleBackToInstitutions} />
            ) : (
                <>
                    <PageHeader
                        title="Institution Management"
                        subtitle="Manage educational institutions in the system"
                        action={true}
                        actionIcon={<Add />}
                        actionText="Add Institution"
                        onActionClick={handleAddInstitutionClick}
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
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: { xs: "100%", md: 300 } }}
                            />
                            <Box sx={{ flexGrow: 1 }} />
                            <Tooltip title="Filter list">
                                <IconButton onClick={handleFilterClick}>
                                    <FilterList />
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
                                        <TableCell>Country</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Programs</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredInstitutions.map((institution) => (
                                        <TableRow hover key={institution._id}>
                                            <TableCell>{institution.institutionName}</TableCell>
                                            <TableCell>
                                                {institution.locations[0]?.country || "N/A"}
                                            </TableCell>
                                            <TableCell>{institution.institutionType}</TableCell>
                                            <TableCell align="right">
                                                {institution.programs.length}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label="Active"
                                                    color={getStatusColor("Active")}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={(event) => handleActionClick(event, institution)}
                                                >
                                                    <MoreVert />
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
                    <Menu
                        anchorEl={actionMenuAnchorEl}
                        open={Boolean(actionMenuAnchorEl)}
                        onClose={() => handleActionClose(null)}
                    >
                        <MenuItem onClick={() => handleActionClose("View details")}>View details</MenuItem>
                        <MenuItem onClick={() => handleActionClose("Edit")}>Edit</MenuItem>
                        <MenuItem onClick={() => handleActionClose("Manage programs")}>Manage programs</MenuItem>
                        <MenuItem onClick={() => handleActionClose("Toggle status")}>
                            {selectedInstitution?.status === "Active" ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </Menu>
                </>
            )}
        </Box>
    );
}

export default AdminInstitutions;