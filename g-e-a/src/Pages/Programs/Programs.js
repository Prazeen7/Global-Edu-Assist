import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    CircularProgress,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Slider,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
    createTheme,
    ThemeProvider,
    Pagination,
} from "@mui/material";
import {
    FilterList as FilterListIcon,
    Close as CloseIcon,
    Clear as ClearIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Sort as SortIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ProgramCard from "../../components/ProgramCard";
import TabPanel from "../../components/TabPanel";
import axios from "axios";

// SearchBar Component
const SearchBar = ({ searchQuery, onSearchChange }) => {
    return (
        <TextField
            fullWidth
            placeholder="Search programs..."
            value={searchQuery}
            onChange={onSearchChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#4f46e5" }} />
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: "lg",
                    borderColor: "#e0e0e0",
                    "&:hover": {
                        borderColor: "#4f46e5",
                    },
                },
            }}
            sx={{
                fontSize: "1rem",
                fontFamily: "'Inter', sans-serif",
                mb: 0,
            }}
        />
    );
};

// Theme Configuration
const theme = createTheme({
    palette: {
        primary: {
            main: "#4f46e5",
            light: "#6366f1",
            dark: "#4338ca",
        },
        secondary: {
            main: "#6b7280", 
        },
        background: {
            default: "#ffffff",
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontSize: "2rem",
            fontWeight: 700,
            color: "#4f46e5",
        },
        body1: {
            fontSize: "0.875rem",
            color: "#6b7280",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 12,
                },
                contained: {
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#4338ca",
                    },
                },
                outlined: {
                    borderColor: "#6b7280",
                    color: "#6b7280",
                    "&:hover": {
                        borderColor: "#4f46e5",
                        color: "#4f46e5",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                    },
                    padding: "16px",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    cursor: "pointer",
                    "&.MuiChip-clickable:hover": {
                        backgroundColor: "#4f46e5",
                        color: "#ffffff",
                    },
                },
            },
        },
    },
});

// Styled Components
const SearchContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    border: "1px solid #e0e0e0",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        alignItems: "center",
    },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
}));

// Main Component
export default function Programs() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0); // For program level tabs
    const [filterTabValue, setFilterTabValue] = useState(0); // For filter dialog tabs
    const [incomeSourceCount, setIncomeSourceCount] = useState(1);
    const [filters, setFilters] = useState({
        gpa: 0, // Default GPA starts at 0
        englishTest: "",
        testScore: "",
        academicLevel: "",
        fieldOfStudy: "",
        preferredLocation: "",
        studyGap: "",
        workExperience: "",
        visaRefusal: false,
    });
    const [selectedDiscipline, setSelectedDiscipline] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        gpa: 0,
        englishTest: "",
        testScore: "",
        academicLevel: "",
        fieldOfStudy: "",
        preferredLocation: "",
        studyGap: "",
        workExperience: "",
        visaRefusal: false,
    }); // Initialize appliedFilters with defaults
    const [sortOrder, setSortOrder] = useState(""); // "highToLow", "lowToHigh", or ""
    const [sortAnchorEl, setSortAnchorEl] = useState(null); // Anchor element for the dropdown menu
    const isSortMenuOpen = Boolean(sortAnchorEl); // Whether the dropdown menu is open

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Set items per page to 9

    // Default filter values
    const defaultFilters = {
        gpa: 0,
        englishTest: "",
        testScore: "",
        academicLevel: "",
        fieldOfStudy: "",
        preferredLocation: "",
        studyGap: "",
        workExperience: "",
        visaRefusal: false,
    };

    const [institutions, setInstitutions] = useState([]); // State to store fetched institutions
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    // Fetch data from the API
    useEffect(() => {
        axios
            .get("http://localhost:3001/api/institutions")
            .then((response) => {
                setInstitutions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching institutions:", error);
                setError("Failed to fetch institutions. Please try again later.");
                setLoading(false);
            });
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    const parseGPA = (gpaString) => {
        if (!gpaString) return 0; // Default to 0 if no GPA is provided
        const gpaMatch = gpaString.match(/\d+(\.\d+)?/); // Extract numeric GPA value
        return gpaMatch ? parseFloat(gpaMatch[0]) : 0; // Convert to number or default to 0
    };

    // Map institutions data to programs format
    const programs = institutions.flatMap((institution) =>
        Object.entries(institution.programs || {}).map(([programName, programDetails]) => ({
            id: `${institution.university}-${programName}`, // Unique key combining university and program name
            program: programName || "N/A",
            institution: institution.university || "N/A",
            level: programDetails.Level || "N/A",
            discipline: programDetails.discipline,
            duration: programDetails.duration || "N/A",
            intakes: programDetails.intakes ? programDetails.intakes.split(",") : [],
            fees: programDetails.Fees_First_Year || "N/A",
            campus: programDetails.campuses || "N/A",
            language_requirements: {
                ielts: parseFloat(programDetails.Language_Requirements?.IELTS) || 0,
                toefl: parseFloat(programDetails.Language_Requirements?.TOEFL) || 0,
                pte: parseFloat(programDetails.Language_Requirements?.PTE) || 0,
            },
            gpa:
                programDetails.Level === "Undergraduate"
                    ? parseGPA(institution.academic_requirements?.undergraduate)
                    : parseGPA(institution.academic_requirements?.postgraduate),
            applicationFees: programDetails.Application_Fee,
            requiredFunds: programDetails.Funds_Required,
        }))
    );

    // Extract unique disciplines from the programs array
    const uniqueDisciplines = [...new Set(programs.map((program) => program.discipline || ""))].filter(Boolean);

    // Filter programs based on search query, selected discipline, and program level
    const filteredPrograms = programs.filter((program) => {
        const matchesSearch =
            (program.program?.toLowerCase() || "").includes(searchQuery) ||
            (program.level?.toLowerCase() || "").includes(searchQuery) ||
            (program.institution?.toLowerCase() || "").includes(searchQuery) ||
            (program.campus?.toLowerCase() || "").includes(searchQuery) ||
            (program.discipline?.toLowerCase() || "").includes(searchQuery);
        const matchesDiscipline = selectedDiscipline
            ? (program.discipline?.toLowerCase() || "") === selectedDiscipline.toLowerCase()
            : true;
        const matchesLevel =
            tabValue === 0 || // All Programs
            (tabValue === 1 && program.level === "Undergraduate") || // Undergraduate
            (tabValue === 2 && program.level === "Postgraduate"); // Postgraduate

        // Only apply GPA filter if appliedFilters.gpa is greater than 0
        const matchesGPA = appliedFilters.gpa > 0 ? program.gpa <= appliedFilters.gpa : true;

        const matchesEnglishTest =
            !appliedFilters.englishTest ||
            (appliedFilters.englishTest === "ielts" && program.ielts >= Number(appliedFilters.testScore));
        const matchesAcademicLevel =
            !appliedFilters.academicLevel ||
            (appliedFilters.academicLevel === "high_school" && program.level === "Undergraduate") ||
            (appliedFilters.academicLevel === "bachelors" && program.level === "Graduate");
        const matchesFieldOfStudy =
            !appliedFilters.fieldOfStudy ||
            (program.discipline?.toLowerCase() || "") === appliedFilters.fieldOfStudy.toLowerCase();

        return (
            matchesSearch &&
            matchesDiscipline &&
            matchesLevel &&
            matchesGPA &&
            matchesEnglishTest &&
            matchesAcademicLevel &&
            matchesFieldOfStudy
        );
    });

    // Sort programs by tuition fee
    const sortedPrograms = [...filteredPrograms].sort((a, b) => {
        const feeA = parseFloat(a.fees.replace(/[^0-9.]/g, "")) || 0;
        const feeB = parseFloat(b.fees.replace(/[^0-9.]/g, "")) || 0;
        if (sortOrder === "highToLow") {
            return feeB - feeA;
        } else if (sortOrder === "lowToHigh") {
            return feeA - feeB;
        }
        return 0;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPrograms = sortedPrograms.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Handle opening the sort dropdown menu
    const handleSortMenuOpen = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    // Handle closing the sort dropdown menu
    const handleSortMenuClose = () => {
        setSortAnchorEl(null);
    };

    // Handle selecting a sort option
    const handleSortOptionSelect = (order) => {
        setSortOrder(order);
        handleSortMenuClose(); // Close the dropdown menu after selection
    };

    // Function to remove a specific filter
    const handleRemoveFilter = (filterKey) => {
        setAppliedFilters((prev) => ({
            ...prev,
            [filterKey]: defaultFilters[filterKey], // Reset to default value
        }));
    };

    // Function to get applied filters as chips
    const getAppliedFilterChips = () => {
        const chips = [];
        for (const [key, value] of Object.entries(appliedFilters)) {
            if (value && value !== defaultFilters[key]) {
                chips.push(
                    <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        onDelete={() => handleRemoveFilter(key)}
                        deleteIcon={<CloseIcon />}
                        sx={{ m: 0.5 }}
                    />
                );
            }
        }
        // Add sort filter chip if a sort order is selected
        if (sortOrder) {
            chips.push(
                <Chip
                    key="sort"
                    label={`${sortOrder === "highToLow" ? "Fee: High to Low" : "Fee: Low to High"}`}
                    onDelete={() => setSortOrder("")}
                    deleteIcon={<CloseIcon />}
                    sx={{ m: 0.5 }}
                />
            );
        }
        return chips;
    };

    // Handlers
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue); // For program level tabs
    };

    const handleFilterTabChange = (event, newValue) => {
        setFilterTabValue(newValue); // For filter dialog tabs
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSliderChange = (name) => (event, newValue) => {
        setFilters((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSwitchChange = (name) => (event) => {
        setFilters((prev) => ({
            ...prev,
            [name]: event.target.checked,
        }));
    };

    const handleChipClick = (discipline) => {
        setSelectedDiscipline(discipline === selectedDiscipline ? "" : discipline);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters); // Apply filters
        setFilterOpen(false); // Close the dialog
    };

    const handleClearFilters = () => {
        setFilters(defaultFilters); // Reset filters to default values
        setAppliedFilters(defaultFilters); // Clear applied filters
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        {/* Header */}
                        <Stack spacing={1} alignItems="center">
                            <Typography variant="h1" textAlign="center" fontSize="2rem">
                                Discover Your Perfect Program
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center" fontSize="0.875rem">
                                Browse through thousands of programs from top institutions worldwide
                            </Typography>
                        </Stack>

                        {/* Search and Filter Section */}
                        <SearchContainer>
                            <Box sx={{ flex: 1 }}>
                                <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                                onClick={() => setFilterOpen(true)}
                            >
                                Filters
                            </Button>

                            {/* Sort Button with Dropdown Menu */}
                            <Button
                                variant="outlined"
                                startIcon={<SortIcon />}
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                                onClick={handleSortMenuOpen}
                                aria-controls="sort-menu"
                                aria-haspopup="true"
                                aria-expanded={isSortMenuOpen ? "true" : undefined}
                            >
                                Sort
                            </Button>
                            <Menu
                                id="sort-menu"
                                anchorEl={sortAnchorEl}
                                open={isSortMenuOpen}
                                onClose={handleSortMenuClose}
                                MenuListProps={{
                                    "aria-labelledby": "sort-button",
                                }}
                            >
                                <MenuItem onClick={() => handleSortOptionSelect("")}>
                                    None
                                </MenuItem>
                                <MenuItem onClick={() => handleSortOptionSelect("highToLow")}>
                                    Fee: High to Low
                                </MenuItem>
                                <MenuItem onClick={() => handleSortOptionSelect("lowToHigh")}>
                                    Fee: Low to High
                                </MenuItem>
                            </Menu>
                        </SearchContainer>

                        {/* Applied Filters Chips */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {getAppliedFilterChips()}
                        </Box>

                        {/* Discipline Chips */}
                        <Stack direction="row" spacing={1} sx={{ mt: 0 }} flexWrap="wrap">
                            {uniqueDisciplines.map((discipline) => (
                                <Chip
                                    key={discipline}
                                    label={discipline}
                                    onClick={() => handleChipClick(discipline)}
                                    sx={{ my: 0.5 }}
                                    color={
                                        selectedDiscipline.toLowerCase() === discipline.toLowerCase()
                                            ? "primary"
                                            : "default"
                                    }
                                />
                            ))}
                        </Stack>

                        {/* Program Level Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} centered>
                                <Tab label="All Programs" />
                                <Tab label="Undergraduate" />
                                <Tab label="Postgraduate" />
                            </Tabs>
                        </Box>

                        {/* Loading State */}
                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Error State */}
                        {error && (
                            <Box sx={{ textAlign: "center", py: 8 }}>
                                <Typography level="h3" sx={{ mb: 1 }}>
                                    Error
                                </Typography>
                                <Typography level="body-md" color="neutral">
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        {/* Program Cards */}
                        <Grid container spacing={3}>
                            {currentPrograms.map((program) => (
                                <Grid item key={program.id} xs={12} sm={6} md={4}>
                                    <ProgramCard program={program} />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Pagination
                                count={Math.ceil(filteredPrograms.length / itemsPerPage)} // Total number of pages
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </Stack>
                </Container>

                {/* Filter Dialog */}
                <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth scroll="paper">
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Tabs value={filterTabValue} onChange={handleFilterTabChange} centered>
                                <Tab label="Academic" />
                                <Tab label="Financial" />
                                <Tab label="Other" />
                            </Tabs>
                            <IconButton onClick={() => setFilterOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <TabPanel value={filterTabValue} index={0}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography gutterBottom>GPA Range</Typography>
                                    <Slider
                                        value={filters.gpa}
                                        step={0.1}
                                        min={0}
                                        max={4.0}
                                        marks={[
                                            { value: 0, label: "0.0" },
                                            { value: 4, label: "4.0" },
                                        ]}
                                        valueLabelDisplay="auto"
                                        onChange={handleSliderChange("gpa")}
                                    />
                                </Box>
                                <FormControl fullWidth>
                                    <InputLabel>English Proficiency Test</InputLabel>
                                    <Select
                                        label="English Proficiency Test"
                                        name="englishTest"
                                        value={filters.englishTest}
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="ielts">IELTS</MenuItem>
                                        <MenuItem value="toefl">TOEFL</MenuItem>
                                        <MenuItem value="pte">PTE</MenuItem>
                                        <MenuItem value="duolingo">Duolingo</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    type="number"
                                    label="Test Score"
                                    name="testScore"
                                    value={filters.testScore}
                                    onChange={handleFilterChange}
                                    disabled={!filters.englishTest} // Disable if no test is selected
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Academic Level</InputLabel>
                                    <Select
                                        label="Academic Level"
                                        name="academicLevel"
                                        value={filters.academicLevel}
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="high_school">High School</MenuItem>
                                        <MenuItem value="bachelors">Bachelor's Degree</MenuItem>
                                        <MenuItem value="masters">Master's Degree</MenuItem>
                                        <MenuItem value="phd">PhD</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Field of Study</InputLabel>
                                    <Select
                                        label="Field of Study"
                                        name="fieldOfStudy"
                                        value={filters.fieldOfStudy}
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="Information Technology">Information Technology</MenuItem>
                                        <MenuItem value="Business">Business</MenuItem>
                                        <MenuItem value="Engineering">Engineering</MenuItem>
                                        <MenuItem value="Medicine">Medicine</MenuItem>
                                        <MenuItem value="Arts">Arts</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={filterTabValue} index={1}>
                            <Stack spacing={3}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={3}>
                                            <Typography variant="subtitle1">Available Funds</Typography>
                                            <TextField type="number" label="Bank Balance" fullWidth />
                                            <TextField type="number" label="Education Loan Amount" fullWidth />
                                            <TextField label="Bank Name" fullWidth />
                                        </Stack>
                                    </CardContent>
                                </Card>
                                {Array.from({ length: incomeSourceCount }).map((_, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Stack spacing={3}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle1">Income Source {index + 1}</Typography>
                                                    {index === incomeSourceCount - 1 && (
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton size="small" onClick={() => setIncomeSourceCount(Math.max(1, incomeSourceCount - 1))}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => setIncomeSourceCount(incomeSourceCount + 1)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                                <FormControl fullWidth>
                                                    <InputLabel>Source Type</InputLabel>
                                                    <Select label="Source Type">
                                                        <MenuItem value="">None</MenuItem>
                                                        <MenuItem value="salary">Salary</MenuItem>
                                                        <MenuItem value="business">Business</MenuItem>
                                                        <MenuItem value="rent">Rental Income</MenuItem>
                                                        <MenuItem value="vehicle">Vehicle Income</MenuItem>
                                                        <MenuItem value="pension">Pension</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField type="number" label="Annual Amount" fullWidth />
                                                <FormControl fullWidth>
                                                    <InputLabel>Source Owner (Sponsor)</InputLabel>
                                                    <Select label="Source Owner (Sponsor)">
                                                        <MenuItem value="">None</MenuItem>
                                                        <MenuItem value="father">Father</MenuItem>
                                                        <MenuItem value="mother">Mother</MenuItem>
                                                        <MenuItem value="brother">Brother</MenuItem>
                                                        <MenuItem value="sister">Sister</MenuItem>
                                                        <MenuItem value="uncle">Uncle</MenuItem>
                                                        <MenuItem value="grandfather">Grandfather</MenuItem>
                                                        <MenuItem value="grandmother">Grandmother</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={3}>
                                            <Typography variant="subtitle1">Total Financial Capacity</Typography>
                                            <Box>
                                                <Typography gutterBottom>Required Funds Range</Typography>
                                                <Slider
                                                    defaultValue={25000}
                                                    step={1000}
                                                    min={0}
                                                    max={100000}
                                                    marks={[
                                                        { value: 0, label: "$0" },
                                                        { value: 100000, label: "$100,000+" },
                                                    ]}
                                                    valueLabelDisplay="auto"
                                                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                                                />
                                            </Box>
                                            <FormControlLabel control={<Switch />} label="Include Living Expenses" />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={filterTabValue} index={2}>
                            <Stack spacing={3}>
                                <TextField
                                    type="number"
                                    label="Study Gap (Years)"
                                    name="studyGap"
                                    value={filters.studyGap}
                                    onChange={handleFilterChange}
                                />
                                <TextField
                                    type="number"
                                    label="Work Experience (Years)"
                                    name="workExperience"
                                    value={filters.workExperience}
                                    onChange={handleFilterChange}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Preferred Location</InputLabel>
                                    <Select
                                        label="Preferred Location"
                                        name="preferredLocation"
                                        value={filters.preferredLocation}
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="sydney">Sydney</MenuItem>
                                        <MenuItem value="melbourne">Melbourne</MenuItem>
                                        <MenuItem value="brisbane">Brisbane</MenuItem>
                                        <MenuItem value="perth">Perth</MenuItem>
                                        <MenuItem value="adelaide">Adelaide</MenuItem>
                                        <MenuItem value="gold-coast">Gold Coast</MenuItem>
                                        <MenuItem value="canberra">Canberra</MenuItem>
                                        <MenuItem value="hobart">Hobart</MenuItem>
                                        <MenuItem value="darwin">Darwin</MenuItem>
                                        <MenuItem value="cairns">Cairns</MenuItem>
                                    </Select>
                                </FormControl>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography variant="subtitle1">Immigration History</Typography>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        name="visaRefusal"
                                                        checked={filters.visaRefusal}
                                                        onChange={handleSwitchChange("visaRefusal")}
                                                    />
                                                }
                                                label="Previous Visa Refusal"
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </TabPanel>
                    </DialogContent>
                    <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={handleClearFilters}
                            sx={{ color: "#6b7280", borderColor: "#6b7280" }}
                        >
                            Clear Filters
                        </Button>
                        <Button variant="contained" onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </Box>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}