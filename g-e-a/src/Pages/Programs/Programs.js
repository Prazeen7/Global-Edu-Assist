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

// Utility function to shuffle an array using the Fisher-Yates algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

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

// Main Component
export default function Programs() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0); // For program level tabs
    const [filterTabValue, setFilterTabValue] = useState(0); // For filter dialog tabs
    const [tempFilters, setTempFilters] = useState({
        gpa: 0,
        englishTest: "",
        testScore: "",
        academicLevel: "",
        fieldOfStudy: "",
        preferredLocation: "",
        visaRefusal: false,
        bankBalance: null,
        educationLoan: null,
        educationLoanBank: "",
        incomeSources: [{ incomeSourceType: "", totalIncome: null, sourceOwner: "" }],
    });
    const [appliedFilters, setAppliedFilters] = useState({
        gpa: 0,
        englishTest: "",
        testScore: "",
        academicLevel: "",
        fieldOfStudy: "",
        preferredLocation: "",
        visaRefusal: false,
        bankBalance: null,
        educationLoan: null,
        educationLoanBank: "",
        incomeSources: [{ incomeSourceType: "", totalIncome: null, sourceOwner: "" }],
    });
    const [selectedDiscipline, setSelectedDiscipline] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const isSortMenuOpen = Boolean(sortAnchorEl);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [institutions, setInstitutions] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]); // Store filtered programs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Default filter values
    const defaultFilters = {
        gpa: 0,
        englishTest: "",
        testScore: "",
        academicLevel: "",
        fieldOfStudy: "",
        preferredLocation: "",
        visaRefusal: false,
        bankBalance: null,
        educationLoan: null,
        educationLoanBank: "",
        incomeSources: [{ incomeSourceType: "", totalIncome: null, sourceOwner: "" }],
    };

    // Fetch data from the API and shuffle programs only once on page load
    useEffect(() => {
        axios
            .get("http://localhost:3001/api/institutions")
            .then((response) => {
                const shuffledPrograms = shuffleArray(
                    response.data.flatMap((institution) =>
                        Object.entries(institution.programs || {}).map(([programName, programDetails]) => ({
                            id: `${institution.university}-${programName}`,
                            program: programName || "N/A",
                            institution: institution.university || "N/A",
                            level: programDetails.Level || "N/A",
                            discipline: programDetails.discipline,
                            duration: programDetails.duration || "N/A",
                            intakes: programDetails.intakes ? programDetails.intakes.split(",") : [],
                            fees: programDetails.Fees_First_Year || "N/A",
                            campus: programDetails.campuses || "N/A",
                            language_requirement: programDetails.language_requirement || {}, 
                            gpa:
                                programDetails.Level === "Undergraduate"
                                    ? parseGPA(institution.academic_requirements?.undergraduate)
                                    : parseGPA(institution.academic_requirements?.postgraduate),
                            applicationFees: programDetails.Application_Fee,
                            requiredFunds: programDetails.Funds_Required,
                            institutionData: institution,
                            url: programDetails.url || "#",
                        }))
                    )
                );
                setInstitutions(shuffledPrograms);
                setFilteredPrograms(shuffledPrograms); 
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching institutions:", error);
                setError("Failed to fetch institutions. Please try again later.");
                setLoading(false);
            });
    }, []);

    // Parse GPA from string
    const parseGPA = (gpaString) => {
        if (!gpaString) return 0;
        const gpaMatch = gpaString.match(/\d+(\.\d+)?/);
        return gpaMatch ? parseFloat(gpaMatch[0]) : 0;
    };

    // Calculate total required funds for a program
    const calculateTotalRequiredFunds = (program) => {
        const firstYearFees = parseFloat(program.fees.replace(/[^0-9.]/g, "")) || 0;
        const livingExpenses = 29710; // AUD 29,710
        const travellingExpenses = 2500; // AUD 2,500
        const healthCover = 2500; // AUD 2,500
        return firstYearFees + livingExpenses + travellingExpenses + healthCover;
    };

    // Extract unique disciplines
    const uniqueDisciplines = [...new Set(institutions.map((program) => program.discipline || ""))].filter(Boolean);

    // Extract unique acceptable banks
    const acceptableBanks = [
        ...new Set(
            institutions.flatMap((institution) =>
                institution.institutionData?.documents?.GS_Stage?.additional_info?.["Acceptable Banks"] || []
            )
        ),
    ].filter((bank) => bank);

    // Filter programs based on search query, selected discipline, program level, and financial filters
    const filterPrograms = (programs, filters) => {
        return programs.filter((program) => {
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
                (tabValue === 1 && program.level === "Undergraduate") || 
                (tabValue === 2 && program.level === "Postgraduate");

            // GPA Filter Logic
            const matchesGPA = filters.gpa > 0 ? program.gpa <= filters.gpa : true;

            // English Proficiency Test Filter Logic
            const matchesEnglishTest = (program) => {
                const { englishTest, testScore } = filters;

                // No filter applied if either field is empty
                if (!englishTest || !testScore) return true;

                const languageRequirements = program.language_requirement || {};

                // Get the raw score for the selected test (e.g., "IELTS")
                const rawScore = languageRequirements[englishTest.toUpperCase()];

                // Exclude programs that don't require this test
                if (!rawScore) return false;

                let parsedScore;

                // Handle different test formats
                if (['IELTS', 'PTE'].includes(englishTest.toUpperCase())) {
                    // Split the score into parts (e.g., "6.5/6.0" => ["6.5", "6.0"])
                    const parts = rawScore.split('/');
                    parsedScore = parseFloat(parts[0].trim()); 
                } else if (englishTest.toUpperCase() === 'TOEFL') {
                    // TOEFL scores are typically a single number (e.g., "90")
                    parsedScore = parseFloat(rawScore);
                } else {
                    // For other tests, attempt direct parsing
                    parsedScore = parseFloat(rawScore);
                }

                // Exclude programs with non-numeric scores (e.g., text-based requirements)
                if (isNaN(parsedScore)) return false;

                // Check if the user's score meets or exceeds the program's requirement
                return parsedScore <= Number(testScore);
            };

            // Academic Level Filter Logic
            const matchesAcademicLevel =
                !filters.academicLevel ||
                (filters.academicLevel === "high_school" && program.level === "Undergraduate") ||
                (filters.academicLevel === "bachelors" && program.level === "Postgraduate") ||
                (filters.academicLevel === "masters" && program.level === "Postgraduate") ||
                (filters.academicLevel === "phd" && program.level === "Postgraduate");

            // Field of Study Filter Logic
            const matchesFieldOfStudy =
                !filters.fieldOfStudy ||
                (program.discipline?.toLowerCase() || "") === filters.fieldOfStudy.toLowerCase();

            // Financial Filter Logic
            const totalRequiredFunds = calculateTotalRequiredFunds(program);
            const matchesBankBalance =
                filters.bankBalance === null || filters.bankBalance >= totalRequiredFunds;

            // Education Loan Filter Logic
            const matchesEducationLoan =
                filters.educationLoan === null ||
                (filters.educationLoan >= totalRequiredFunds &&
                    filters.educationLoanBank &&
                    program.institutionData?.documents?.GS_Stage?.additional_info?.["Acceptable Banks"]?.includes(
                        filters.educationLoanBank
                    ));

            // Income Source Filter Logic
            const acceptableIncomeSources =
                program.institutionData?.documents?.GS_Stage?.additional_info?.["Acceptable Income Sources"] || [];
            const minimumIncomeAmountRequired =
                parseFloat(
                    program.institutionData?.documents?.GS_Stage?.additional_info?.["Minimum Income Amount Required"]?.replace(
                        /[^0-9.]/g,
                        ""
                    )
                ) || 0;
            const acceptableSponsors =
                program.institutionData?.documents?.GS_Stage?.additional_info?.["Acceptable Sponsors"] || [];

            // Sum total income from all income sources
            const totalIncome = filters.incomeSources.reduce(
                (sum, source) => sum + (source.totalIncome || 0),
                0
            );

            const matchesIncomeSource =
                filters.incomeSources.every((source) =>
                    !source.incomeSourceType || acceptableIncomeSources.includes(source.incomeSourceType)
                );

            const matchesTotalIncome =
                !totalIncome || totalIncome >= minimumIncomeAmountRequired;

            const matchesSourceOwner =
                filters.incomeSources.every((source) =>
                    !source.sourceOwner || acceptableSponsors.includes(source.sourceOwner)
                );

            // Preferred Location Filter Logic
            const matchesPreferredLocation =
                !filters.preferredLocation ||
                (program.campus?.toLowerCase() || "").includes(filters.preferredLocation.toLowerCase());

            // Immigration History Filter Logic
            const matchesVisaRefusal =
                !filters.visaRefusal ||
                program.institutionData?.documents?.GS_Stage?.additional_info?.["Previous Visa Refusal"]?.startsWith("Accepted");

            return (
                matchesSearch &&
                matchesDiscipline &&
                matchesLevel &&
                matchesGPA &&
                matchesEnglishTest(program) &&
                matchesAcademicLevel &&
                matchesFieldOfStudy &&
                matchesBankBalance &&
                matchesEducationLoan &&
                matchesIncomeSource &&
                matchesTotalIncome &&
                matchesSourceOwner &&
                matchesPreferredLocation &&
                matchesVisaRefusal
            );
        });
    };

    // Apply filters when the "Apply Filter" button is pressed
    const handleApplyFilters = () => {
        const filtered = filterPrograms(institutions, tempFilters);
        setFilteredPrograms(filtered);
        setAppliedFilters(tempFilters);
        setFilterOpen(false);
    };

    // Clear filters
    const handleClearFilters = () => {
        setTempFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setFilteredPrograms(institutions); 
    };

    // Handle income source change
    const handleIncomeSourceChange = (index, field, value) => {
        const updatedIncomeSources = [...tempFilters.incomeSources];
        updatedIncomeSources[index][field] = value;
        setTempFilters((prev) => ({
            ...prev,
            incomeSources: updatedIncomeSources,
        }));
    };

    // Add new income source
    const addIncomeSource = () => {
        setTempFilters((prev) => ({
            ...prev,
            incomeSources: [...prev.incomeSources, { incomeSourceType: "", totalIncome: null, sourceOwner: "" }],
        }));
    };

    // Remove income source
    const removeIncomeSource = (index) => {
        const updatedIncomeSources = tempFilters.incomeSources.filter((_, i) => i !== index);
        setTempFilters((prev) => ({
            ...prev,
            incomeSources: updatedIncomeSources,
        }));
    };

    // Initialize temporary filters when dialog opens
    const handleFilterDialogOpen = () => {
        setTempFilters(appliedFilters);
        setFilterOpen(true);
    };

    // Reset temporary filters when dialog closes without applying
    const handleFilterDialogClose = () => {
        setTempFilters(appliedFilters);
        setFilterOpen(false);
    };

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
        handleSortMenuClose();
    };

    // Function to remove a specific filter
    const handleRemoveFilter = (filterKey) => {
        setAppliedFilters((prev) => ({
            ...prev,
            [filterKey]: defaultFilters[filterKey],
        }));
        setTempFilters((prev) => ({
            ...prev,
            [filterKey]: defaultFilters[filterKey],
        }));
    };

    // Function to get applied filters as chips
    const getAppliedFilterChips = () => {
        const chips = [];
        for (const [key, value] of Object.entries(appliedFilters)) {
            if (value && value !== defaultFilters[key]) {
                let displayValue = value;

                // Handle income sources separately
                if (key === "incomeSources") {
                    const hasNonDefaultIncomeSources = value.some(
                        (source) =>
                            source.incomeSourceType !== "" ||
                            source.totalIncome !== null ||
                            source.sourceOwner !== ""
                    );

                    if (hasNonDefaultIncomeSources) {
                        displayValue = value
                            .map((source) => `${source.incomeSourceType}: $${source.totalIncome}`)
                            .join(", ");
                        chips.push(
                            <Chip
                                key={key}
                                label={`${key}: ${displayValue}`}
                                onDelete={() => handleRemoveFilter(key)}
                                deleteIcon={<CloseIcon />}
                                sx={{ m: 0.5 }}
                            />
                        );
                    }
                } else {
                    chips.push(
                        <Chip
                            key={key}
                            label={`${key}: ${displayValue}`}
                            onDelete={() => handleRemoveFilter(key)}
                            deleteIcon={<CloseIcon />}
                            sx={{ m: 0.5 }}
                        />
                    );
                }
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
        setTabValue(newValue);
    };

    const handleFilterTabChange = (event, newValue) => {
        setFilterTabValue(newValue);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setTempFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSliderChange = (name) => (event, newValue) => {
        setTempFilters((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSwitchChange = (name) => (event) => {
        setTempFilters((prev) => ({
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
                                onClick={handleFilterDialogOpen}
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
                        {filteredPrograms.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 8 }}>
                                <Typography level="h3" sx={{ mb: 1 }}>
                                    No Programs Found
                                </Typography>
                                <Typography level="body-md" color="neutral">
                                    Try adjusting your filters or search terms.
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {currentPrograms.map((program) => (
                                    <Grid item key={program.id} xs={12} sm={6} md={4}>
                                        <ProgramCard program={program} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* Pagination */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Pagination
                                count={Math.ceil(filteredPrograms.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </Stack>
                </Container>

                {/* Filter Dialog */}
                <Dialog open={filterOpen} onClose={handleFilterDialogClose} maxWidth="md" fullWidth scroll="paper">
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Tabs value={filterTabValue} onChange={handleFilterTabChange} centered>
                                <Tab label="Academic" />
                                <Tab label="Financial" />
                                <Tab label="Other" />
                            </Tabs>
                            <IconButton onClick={handleFilterDialogClose}>
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
                                        value={tempFilters.gpa}
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
                                        value={tempFilters.englishTest}
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
                                    value={tempFilters.testScore}
                                    onChange={handleFilterChange}
                                    disabled={!tempFilters.englishTest}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Academic Level</InputLabel>
                                    <Select
                                        label="Academic Level"
                                        name="academicLevel"
                                        value={tempFilters.academicLevel}
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
                                        value={tempFilters.fieldOfStudy}
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
                                            <TextField
                                                type="number"
                                                label="Bank Balance"
                                                fullWidth
                                                value={tempFilters.bankBalance || ""}
                                                onChange={(e) =>
                                                    setTempFilters((prev) => ({
                                                        ...prev,
                                                        bankBalance: e.target.value ? parseFloat(e.target.value) : null,
                                                    }))
                                                }
                                            />
                                            <TextField
                                                type="number"
                                                label="Education Loan Amount"
                                                fullWidth
                                                value={tempFilters.educationLoan || ""}
                                                onChange={(e) =>
                                                    setTempFilters((prev) => ({
                                                        ...prev,
                                                        educationLoan: e.target.value ? parseFloat(e.target.value) : null,
                                                    }))
                                                }
                                            />
                                            <FormControl fullWidth>
                                                <InputLabel>Bank Name</InputLabel>
                                                <Select
                                                    label="Bank Name"
                                                    value={tempFilters.educationLoanBank || ""}
                                                    onChange={(e) =>
                                                        setTempFilters((prev) => ({
                                                            ...prev,
                                                            educationLoanBank: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <MenuItem value="">None</MenuItem>
                                                    {acceptableBanks.map((bank) => (
                                                        <MenuItem key={bank} value={bank}>
                                                            {bank}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Income Source Section */}
                                {tempFilters.incomeSources.map((source, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Stack spacing={3}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle1">Income Source {index + 1}</Typography>
                                                    {index === tempFilters.incomeSources.length - 1 && (
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton size="small" onClick={() => removeIncomeSource(index)}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={addIncomeSource}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                                <FormControl fullWidth>
                                                    <InputLabel>Source Type</InputLabel>
                                                    <Select
                                                        label="Source Type"
                                                        value={source.incomeSourceType || ""}
                                                        onChange={(e) =>
                                                            handleIncomeSourceChange(index, "incomeSourceType", e.target.value)
                                                        }
                                                    >
                                                        <MenuItem value="">None</MenuItem>
                                                        <MenuItem value="Salary from Employment">Salary from Employment</MenuItem>
                                                        <MenuItem value="Business Income">Business Income</MenuItem>
                                                        <MenuItem value="Rental Income">Rental Income</MenuItem>
                                                        <MenuItem value="Agricultural Income">Agricultural Income</MenuItem>
                                                        <MenuItem value="Pension">Pension</MenuItem>
                                                        <MenuItem value="Foreign Employment Income">Foreign Employment Income</MenuItem>
                                                        <MenuItem value="Income from Investments">Income from Investments</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    type="number"
                                                    label="Total Income (Annual)"
                                                    fullWidth
                                                    value={source.totalIncome || ""}
                                                    onChange={(e) =>
                                                        handleIncomeSourceChange(index, "totalIncome", e.target.value ? parseFloat(e.target.value) : null)
                                                    }
                                                />
                                                <FormControl fullWidth>
                                                    <InputLabel>Source Owner (Sponsor)</InputLabel>
                                                    <Select
                                                        label="Source Owner (Sponsor)"
                                                        value={source.sourceOwner || ""}
                                                        onChange={(e) =>
                                                            handleIncomeSourceChange(index, "sourceOwner", e.target.value)
                                                        }
                                                    >
                                                        <MenuItem value="">None</MenuItem>
                                                        <MenuItem value="Parents">Parents</MenuItem>
                                                        <MenuItem value="Siblings">Siblings</MenuItem>
                                                        <MenuItem value="Spouse">Spouse</MenuItem>
                                                        <MenuItem value="Relatives">Relatives</MenuItem>
                                                        <MenuItem value="Employers">Employers</MenuItem>
                                                        <MenuItem value="Educational Institutions">Educational Institutions</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </TabPanel>
                        <TabPanel value={filterTabValue} index={2}>
                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Preferred Location</InputLabel>
                                    <Select
                                        label="Preferred Location"
                                        name="preferredLocation"
                                        value={tempFilters.preferredLocation}
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
                                                        checked={tempFilters.visaRefusal}
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