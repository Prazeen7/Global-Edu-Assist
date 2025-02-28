import { useState } from "react";
import {
    Avatar,
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
    InputLabel,
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
} from "@mui/material";
import {
    Add as AddIcon,
    FilterList as FilterListIcon,
    Remove as RemoveIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ProgramCard from "../../components/ProgramCard";
import TabPanel from "../../components/TabPanel";

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
            }}
            sx={{
                fontSize: "1rem",
                fontFamily: "'Inter', sans-serif",
                mb: 0, 
            }}
        />
    );
};


const theme = createTheme({
    palette: {
        primary: {
            main: "#4f46e5",
            light: "#6366f1",
            dark: "#4338ca",
        },
        background: {
            default: "#f8fafc",
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#4f46e5",
        },
        body1: {
            fontSize: "1rem",
            color: "#6b7280",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 12,
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#4338ca",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                    },
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

export default function Programs() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [incomeSourceCount, setIncomeSourceCount] = useState(1);
    const [filters, setFilters] = useState({
        gpa: 3.0,
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

    const programs = [
        {
            id: 1,
            program: "Computer Science",
            institution: "University of Tech",
            level: "Undergraduate",
            discipline: "Information Technology",
            duration: "4 years",
            intakes: ["Fall", "Spring"],
            fees: 15000,
            campus: "Main Campus",
            ielts: 6.5,
            gpa: 3.5,
        },
        {
            id: 2,
            program: "Business Administration",
            institution: "Business School",
            level: "Graduate",
            discipline: "Business",
            duration: "2 years",
            intakes: ["Fall"],
            fees: 20000,
            campus: "Downtown Campus",
            ielts: 7.0,
            gpa: 3.8,
        },
        {
            id: 3,
            program: "Data Science",
            institution: "Tech Institute",
            level: "Graduate",
            discipline: "Information Technology",
            duration: "2 years",
            intakes: ["Fall", "Spring"],
            fees: 18000,
            campus: "Innovation Campus",
            ielts: 7.0,
            gpa: 3.7,
        },
    ];

    // Filter programs based on search query and selected discipline
    const filteredPrograms = programs.filter((program) => {
        const matchesSearch =
            program.program.toLowerCase().includes(searchQuery) ||
            program.level.toLowerCase().includes(searchQuery) ||
            program.institution.toLowerCase().includes(searchQuery) ||
            program.campus.toLowerCase().includes(searchQuery);
        const matchesDiscipline = selectedDiscipline
            ? program.discipline.toLowerCase() === selectedDiscipline.toLowerCase()
            : true;
        return matchesSearch && matchesDiscipline && program.gpa >= filters.gpa;
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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
        setSelectedDiscipline(
            discipline === selectedDiscipline ? "" : discipline
        );
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
                            <Typography variant="h1" textAlign="center" fontSize="2.25rem">
                                Discover Your Perfect Program
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center" fontSize="1.125rem">
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
                        </SearchContainer>

                        {/* Discipline Chips */}
                        <Stack direction="row" spacing={1} sx={{ mt: 0 }} flexWrap="wrap">
                            {[
                                "Information Technology",
                                "Business",
                                "Engineering",
                                "Medicine",
                                "Arts",
                            ].map((discipline) => (
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

                        {/* Program Cards */}
                        <Grid container spacing={3}>
                            {filteredPrograms.map((program) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
                                    <ProgramCard program={program} />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Container>

                {/* Filter Dialog */}
                <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth scroll="paper">
                    <DialogTitle>
                        <Tabs value={tabValue} onChange={handleTabChange} centered>
                            <Tab label="Academic" />
                            <Tab label="Financial" />
                            <Tab label="Other" />
                        </Tabs>
                    </DialogTitle>
                    <DialogContent dividers>
                        <TabPanel value={tabValue} index={0}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography gutterBottom>GPA Range</Typography>
                                    <Slider
                                        defaultValue={3.0}
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
                                    <Select label="English Proficiency Test" name="englishTest" value={filters.englishTest} onChange={handleFilterChange}>
                                        <MenuItem value="ielts">IELTS</MenuItem>
                                        <MenuItem value="toefl">TOEFL</MenuItem>
                                        <MenuItem value="pte">PTE</MenuItem>
                                        <MenuItem value="duolingo">Duolingo</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField type="number" label="Test Score" name="testScore" value={filters.testScore} onChange={handleFilterChange} />
                                <FormControl fullWidth>
                                    <InputLabel>Academic Level</InputLabel>
                                    <Select label="Academic Level" name="academicLevel" value={filters.academicLevel} onChange={handleFilterChange}>
                                        <MenuItem value="high_school">High School</MenuItem>
                                        <MenuItem value="bachelors">Bachelor's Degree</MenuItem>
                                        <MenuItem value="masters">Master's Degree</MenuItem>
                                        <MenuItem value="phd">PhD</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Field of Study</InputLabel>
                                    <Select label="Field of Study" name="fieldOfStudy" value={filters.fieldOfStudy} onChange={handleFilterChange}>
                                        <MenuItem value="cs">Computer Science</MenuItem>
                                        <MenuItem value="engineering">Engineering</MenuItem>
                                        <MenuItem value="business">Business</MenuItem>
                                        <MenuItem value="arts">Arts</MenuItem>
                                        <MenuItem value="medicine">Medicine</MenuItem>
                                        <MenuItem value="law">Law</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
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
                        <TabPanel value={tabValue} index={2}>
                            <Stack spacing={3}>
                                <TextField type="number" label="Study Gap (Years)" name="studyGap" value={filters.studyGap} onChange={handleFilterChange} />
                                <TextField type="number" label="Work Experience (Years)" name="workExperience" value={filters.workExperience} onChange={handleFilterChange} />
                                <FormControl fullWidth>
                                    <InputLabel>Preferred Location</InputLabel>
                                    <Select label="Preferred Location" name="preferredLocation" value={filters.preferredLocation} onChange={handleFilterChange}>
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
                                            <FormControlLabel control={<Switch name="visaRefusal" checked={filters.visaRefusal} onChange={handleSwitchChange("visaRefusal")} />} label="Previous Visa Refusal" />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </TabPanel>
                    </DialogContent>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}