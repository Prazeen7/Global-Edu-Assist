import React, { useState, useEffect } from "react";
import axios from "axios";
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
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TablePagination,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import PageHeader from "../../components/Admin/PageHeader";
import AddInstitution from "../../components/Admin/AddInstitutions";
import AdminInstitutionsPage from "./InstitutionPage";

function AdminInstitutions() {
    const [institutions, setInstitutions] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("institutionName");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [showAddInstitution, setShowAddInstitution] = useState(false);
    const [showInstitutionDetails, setShowInstitutionDetails] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchInstitutions();
    }, [searchTerm]);

    const fetchInstitutions = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/institutions");
            const sortedData = response.data.sort((a, b) =>
                a.institutionName.localeCompare(b.institutionName)
            );
            setInstitutions(sortedData);
        } catch (error) {
            console.error("Error fetching institutions:", error);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleAddInstitutionClick = () => {
        setShowAddInstitution(true);
    };

    const handleBackToInstitutions = () => {
        setShowAddInstitution(false);
        setShowInstitutionDetails(false);
        fetchInstitutions();
    };

    const handleRowClick = (institution) => {
        setSelectedInstitution(institution);
        setShowInstitutionDetails(true);
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter institutions based on search term
    const filteredInstitutions = institutions.filter((institution) =>
        institution.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort institutions
    const sortedInstitutions = filteredInstitutions.sort((a, b) => {
        if (orderBy === "institutionName") {
            return order === "asc"
                ? a.institutionName.localeCompare(b.institutionName)
                : b.institutionName.localeCompare(a.institutionName);
        } else {
            if (order === "asc") {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            } else {
                return a[orderBy] < b[orderBy] ? 1 : -1;
            }
        }
    });

    // Paginate institutions
    const paginatedInstitutions = sortedInstitutions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ p: 3 }}>
            {showAddInstitution ? (
                <AddInstitution onClose={handleBackToInstitutions} />
            ) : showInstitutionDetails ? (
                <AdminInstitutionsPage institution={selectedInstitution} onClose={handleBackToInstitutions} />
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
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="rows-per-page-label">Per Page</InputLabel>
                                <Select
                                    labelId="rows-per-page-label"
                                    id="rows-per-page"
                                    value={rowsPerPage}
                                    label="Per Page"
                                    onChange={handleChangeRowsPerPage}
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
                                        <TableCell>SN</TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === "institutionName"}
                                                direction={orderBy === "institutionName" ? order : "asc"}
                                                onClick={() => handleRequestSort("institutionName")}
                                            >
                                                Institution Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Programs</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedInstitutions.map((institution, index) => (
                                        <TableRow
                                            hover
                                            key={institution._id}
                                            onClick={() => handleRowClick(institution)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{institution.institutionName}</TableCell>
                                            <TableCell>
                                                {institution.locations[0]?.country || "N/A"}
                                            </TableCell>
                                            <TableCell>{institution.institutionType}</TableCell>
                                            <TableCell align="right">
                                                {institution.programs.length}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50, 100]}
                            component="div"
                            count={filteredInstitutions.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </>
            )}
        </Box>
    );
}

export default AdminInstitutions;