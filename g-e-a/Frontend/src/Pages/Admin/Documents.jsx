import { useState, useEffect } from "react"
import axios from "../../utils/axiosConfig"
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
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TablePagination from "@mui/material/TablePagination"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DescriptionIcon from "@mui/icons-material/Description"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PageHeader from "../../components/Admin/PageHeader"
import DocumentForm from "../../components/Admin/DocumentForm"

function Documents() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("document")
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [anchorEl, setAnchorEl] = useState(null)
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null)
    const [selectedDocument, setSelectedDocument] = useState(null)

    // Dialog states
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    // Alert state
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    })

    useEffect(() => {
        fetchDocuments()
    }, [])

    useEffect(() => {
        if (alert.open) {
            const timer = setTimeout(() => {
                setAlert({ ...alert, open: false })
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [alert])

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/documents")
            if (Array.isArray(response.data)) {
                setDocuments(response.data)
            } else {
                setDocuments([])
            }
            setLoading(false)
        } catch (err) {
            console.error("Error fetching documents:", err)
            setError("Failed to load documents. Please try again later.")
            setLoading(false)
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

    const handleActionClick = (event, document) => {
        setActionMenuAnchorEl(event.currentTarget)
        setSelectedDocument(document)
    }

    const handleActionClose = () => {
        setActionMenuAnchorEl(null)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleAddDocument = () => {
        setOpenAddDialog(true)
    }

    const handleEditDocument = () => {
        setOpenEditDialog(true)
        handleActionClose()
    }

    const handleDeleteDocument = () => {
        setOpenDeleteDialog(true)
        handleActionClose()
    }

    const handleCloseDialog = () => {
        setOpenAddDialog(false)
        setOpenEditDialog(false)
        setOpenDeleteDialog(false)
    }

    const showAlert = (message, severity = "success") => {
        setAlert({
            open: true,
            message,
            severity,
        })
    }

    const saveDocument = async (documentData) => {
        try {
            await axios.post("/documents", documentData)
            fetchDocuments()
            handleCloseDialog()
            showAlert("Document added successfully!")
        } catch (err) {
            console.error("Error adding document:", err)
            showAlert("Failed to add document", "error")
        }
    }

    const updateDocument = async (documentData) => {
        try {
            await axios.put(`/documents/${selectedDocument._id}`, documentData)
            fetchDocuments()
            handleCloseDialog()
            showAlert("Changes saved successfully!")
        } catch (err) {
            console.error("Error updating document:", err)
            showAlert("Failed to update document", "error")
        }
    }

    const deleteDocument = async () => {
        try {
            await axios.delete(`/documents/${selectedDocument._id}`)
            fetchDocuments()
            handleCloseDialog()
            showAlert("Document deleted successfully!")
        } catch (err) {
            console.error("Error deleting document:", err)
            showAlert("Failed to delete document", "error")
        }
    }

    // Sort and filter documents
    const getFilteredDocuments = () => {
        const filteredDocs = documents.filter((doc) => doc.document.toLowerCase().includes(searchTerm.toLowerCase()))

        return filteredDocs.sort((a, b) => {
            const isAsc = order === "asc"
            if (a[orderBy] < b[orderBy]) {
                return isAsc ? -1 : 1
            }
            if (a[orderBy] > b[orderBy]) {
                return isAsc ? 1 : -1
            }
            return 0
        })
    }

    const filteredDocuments = getFilteredDocuments()
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredDocuments.length) : 0
    const paginatedDocuments = filteredDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                <CircularProgress />
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
        <Box sx={{ p: 3, position: "relative" }}>
            {/* Centered alert notification */}
            <Collapse in={alert.open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                        minWidth: 300,
                        maxWidth: 500,
                    }}
                >
                    <Alert
                        severity={alert.severity}
                        variant="filled"
                        sx={{ boxShadow: 3 }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setAlert({ ...alert, open: false })}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {alert.message}
                    </Alert>
                </Box>
            </Collapse>

            <PageHeader
                title="Documents Management"
                subtitle="Manage document requirements for applications"
                action={true}
                actionIcon={<AddIcon />}
                actionText="Add Document"
                onActionClick={handleAddDocument}
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
                </Toolbar>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "document"}
                                        direction={orderBy === "document" ? order : "asc"}
                                        onClick={() => handleRequestSort("document")}
                                    >
                                        Document Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Number of Documents</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedDocuments.length > 0 ? (
                                paginatedDocuments.map((doc) => (
                                    <TableRow hover key={doc._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <DescriptionIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                                {doc.document}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{doc.docs.length}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(event) => handleActionClick(event, doc)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No documents found
                                    </TableCell>
                                </TableRow>
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={3} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredDocuments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Filter Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                <MenuItem onClick={handleFilterClose}>All Documents</MenuItem>
                <MenuItem onClick={handleFilterClose}>Academic Documents</MenuItem>
                <MenuItem onClick={handleFilterClose}>Financial Documents</MenuItem>
                <MenuItem onClick={handleFilterClose}>Identification Documents</MenuItem>
            </Menu>

            {/* Action Menu */}
            <Menu anchorEl={actionMenuAnchorEl} open={Boolean(actionMenuAnchorEl)} onClose={handleActionClose}>
                <MenuItem onClick={handleEditDocument}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteDocument}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Add Document Dialog */}
            <Dialog open={openAddDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogContent>
                    <DocumentForm onSave={saveDocument} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Document Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Edit Document</DialogTitle>
                <DialogContent>
                    {selectedDocument && <DocumentForm initialData={selectedDocument} onSave={updateDocument} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Delete Document</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={deleteDocument} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Documents
