import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Tabs,
    Tab,
    Box,
    Stack,
    Typography,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Card,
    CardContent,
    IconButton,
    FormControlLabel,
    Switch,
    Button,
} from "@mui/material";
import { Close as CloseIcon, Clear as ClearIcon, Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import TabPanel from "../../components/TabPanel";

const FilterDialog = ({ open, onClose, filters, onFilterChange, onSliderChange, onSwitchChange, onApplyFilters, onClearFilters }) => {
    const [filterTabValue, setFilterTabValue] = useState(0);
    const [incomeSourceCount, setIncomeSourceCount] = useState(1);

    const handleFilterTabChange = (event, newValue) => {
        setFilterTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Tabs value={filterTabValue} onChange={handleFilterTabChange} centered>
                        <Tab label="Academic" />
                        <Tab label="Financial" />
                        <Tab label="Other" />
                    </Tabs>
                    <IconButton onClick={onClose}>
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
                                onChange={onSliderChange("gpa")}
                            />
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>English Proficiency Test</InputLabel>
                            <Select
                                label="English Proficiency Test"
                                name="englishTest"
                                value={filters.englishTest}
                                onChange={onFilterChange}
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
                            onChange={onFilterChange}
                            disabled={!filters.englishTest}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Academic Level</InputLabel>
                            <Select
                                label="Academic Level"
                                name="academicLevel"
                                value={filters.academicLevel}
                                onChange={onFilterChange}
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
                                onChange={onFilterChange}
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
                            onChange={onFilterChange}
                        />
                        <TextField
                            type="number"
                            label="Work Experience (Years)"
                            name="workExperience"
                            value={filters.workExperience}
                            onChange={onFilterChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Preferred Location</InputLabel>
                            <Select
                                label="Preferred Location"
                                name="preferredLocation"
                                value={filters.preferredLocation}
                                onChange={onFilterChange}
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
                                                onChange={onSwitchChange("visaRefusal")}
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
                    onClick={onClearFilters}
                    sx={{ color: "#6b7280", borderColor: "#6b7280" }}
                >
                    Clear Filters
                </Button>
                <Button variant="contained" onClick={onApplyFilters}>
                    Apply Filters
                </Button>
            </Box>
        </Dialog>
    );
};

export default FilterDialog;