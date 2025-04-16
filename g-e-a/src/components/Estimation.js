import React, { useState, useRef, useEffect } from "react";
import {
    Typography,
    Container,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    InputLabel,
    Radio,
    RadioGroup,
    Checkbox,
    LinearProgress,
    Tabs,
    Tab,
    Table,
    CircularProgress,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Box,
    Chip,
    Alert,
    AlertTitle,
    InputAdornment,
} from "@mui/material";
import {
    Calculate,
    GetApp,
    Description,
    MenuBook,
    FileCopy,
    Apartment,
    School,
    Flight,
    AttachMoney,
    ArrowForward,
    CreditCard,
    AccountBalance,
    TextSnippet,
    Gavel,
    Public,
} from "@mui/icons-material";
import { useCalculation } from "./Calculation";
import { generateReport } from "./Report";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function EstimateCostsTab() {
    const primaryColor = "#4f46e5";

    const {
        englishTest,
        setEnglishTest,
        englishClassCost,
        setEnglishClassCost,
        examType,
        setExamType,
        applicationCost,
        setApplicationCost,
        loanAmount,
        setLoanAmount,
        bankProcessingRate,
        setBankProcessingRate,
        disbursementAmount,
        setDisbursementAmount,
        interestRate,
        setInterestRate,
        translationPages,
        setTranslationPages,
        notaryPages,
        setNotaryPages,
        bankValuation,
        setBankValuation,
        caReport,
        setCAReport,
        propertyValuation,
        setPropertyValuation,
        nocPrograms,
        setNocPrograms,
        tuitionFee,
        setTuitionFee,
        paymentCompanyFee,
        setPaymentCompanyFee,
        healthCareCost,
        setHealthCareCost,
        medicalProvider,
        setMedicalProvider,
        getExamFee,
        getBankProcessingFee,
        getMonthlyInstallment,
        getTranslationCost,
        getNotaryCost,
        getEngineeringCost,
        getNocCost,
        getEducationTax,
        getMedicalCost,
        getTotalCost,
        getCategoryTotal,
    } = useCalculation();

    // UI State
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(20);
    const [errors, setErrors] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    // Create refs to store form values
    const formRefs = useRef({
        englishTest,
        englishClassCost,
        examType,
        applicationCost,
        loanAmount,
        bankProcessingRate,
        disbursementAmount,
        interestRate,
        translationPages,
        notaryPages,
        bankValuation,
        caReport,
        propertyValuation,
        nocPrograms,
        tuitionFee,
        paymentCompanyFee,
        healthCareCost,
        medicalProvider,
    });

    // Helper function for handling number inputs
    const handleNumberChange = (setter) => (e) => {
        const value = e.target.value;
        if (value === "") {
            setter("");
        } else {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                setter(numValue);
            }
        }
    };

    // Function to disable scroll behavior
    const disableScroll = (e) => e.target.blur();

    // Update refs when state changes
    useEffect(() => {
        formRefs.current = {
            englishTest,
            englishClassCost,
            examType,
            applicationCost,
            loanAmount,
            bankProcessingRate,
            disbursementAmount,
            interestRate,
            translationPages,
            notaryPages,
            bankValuation,
            caReport,
            propertyValuation,
            nocPrograms,
            tuitionFee,
            paymentCompanyFee,
            healthCareCost,
            medicalProvider,
        };
    }, [
        englishTest,
        englishClassCost,
        examType,
        applicationCost,
        loanAmount,
        bankProcessingRate,
        disbursementAmount,
        interestRate,
        translationPages,
        notaryPages,
        bankValuation,
        caReport,
        propertyValuation,
        nocPrograms,
        tuitionFee,
        paymentCompanyFee,
        healthCareCost,
        medicalProvider,
    ]);

    // Update progress based on active tab
    useEffect(() => {
        const progressMap = [20, 40, 60, 80, 100];
        setProgress(progressMap[activeTab] || 20);
    }, [activeTab]);

    // Calculate costs
    const calculateCosts = () => {
        const newErrors = {};
        
        const loanAmt = loanAmount === "" ? 0 : loanAmount;
        const disbAmt = disbursementAmount === "" ? 0 : disbursementAmount;
        const tuitFee = tuitionFee === "" ? 0 : tuitionFee;

        if (loanAmt < 0) newErrors.loanAmount = "Loan amount cannot be negative";
        if (disbAmt < 0) newErrors.disbursementAmount = "Disbursement amount cannot be negative";
        if (tuitFee < 0) newErrors.tuitionFee = "Tuition fee cannot be negative";

        setErrors(newErrors);

        setIsCalculating(true);

        setTimeout(() => {
            setShowResults(true);
            setIsCalculating(false);
        }, 500);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    bgcolor: primaryColor,
                    color: 'white',
                    p: 3,
                    borderRadius: 2,
                    mb: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Calculate sx={{ mr: 1 }} />
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Study Abroad Cost Calculator
                    </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 3 }}>
                    Plan your education journey with our comprehensive cost estimator
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption">{progress}%</Typography>
                        <Typography variant="caption">Progress</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: 'white'
                            }
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={calculateCosts}
                        disabled={isCalculating}
                        startIcon={<Calculate />}
                        sx={{
                            bgcolor: 'white',
                            color: primaryColor,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                    >
                        {isCalculating ? "Calculating..." : "Calculate Total"}
                    </Button>
                </Box>
            </Paper>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="cost calculator tabs"
                        sx={{
                            '& .MuiTab-root': {
                                minWidth: 120,
                                py: 2
                            },
                            '& .Mui-selected': {
                                color: primaryColor,
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: primaryColor,
                            }
                        }}
                    >
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        mb: 0.5
                                    }}>
                                        <MenuBook fontSize="small" sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2">English Test</Typography>
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        mb: 0.5
                                    }}>
                                        <FileCopy fontSize="small" sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2">Offer Letter</Typography>
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        mb: 0.5
                                    }}>
                                        <Apartment fontSize="small" sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2">GS Stage</Typography>
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        mb: 0.5
                                    }}>
                                        <School fontSize="small" sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2">COE Stage</Typography>
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        mb: 0.5
                                    }}>
                                        <Flight fontSize="small" sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2">Visa Stage</Typography>
                                </Box>
                            }
                        />
                    </Tabs>
                </Box>

                {/* English Proficiency Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Card elevation={3}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        mr: 2
                                    }}>
                                        <MenuBook sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h6">English Proficiency</Typography>
                                </Box>
                            }
                            subheader="Language test preparation and examination fees"
                            sx={{
                                bgcolor: `${primaryColor}05`,
                                borderBottom: `1px solid ${primaryColor}20`
                            }}
                        />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!errors.englishTest}>
                                        <InputLabel id="english-test-label">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Public fontSize="small" sx={{ mr: 1 }} />
                                                English Test Type
                                            </Box>
                                        </InputLabel>
                                        <Select
                                            labelId="english-test-label"
                                            id="english-test"
                                            value={englishTest}
                                            onChange={(e) => setEnglishTest(e.target.value)}
                                            label="English Test Type"
                                        >
                                            <MenuItem value="ielts">IELTS</MenuItem>
                                            <MenuItem value="pte">PTE</MenuItem>
                                            <MenuItem value="toefl">TOEFL</MenuItem>
                                        </Select>
                                        {errors.englishTest && (
                                            <Typography variant="caption" color="error">
                                                {errors.englishTest}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="class-cost"
                                            type="number"
                                            value={englishClassCost === "" ? "" : englishClassCost}
                                            onChange={handleNumberChange(setEnglishClassCost)}
                                            onWheel={disableScroll}
                                            label="Average Class Cost (NPR)"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AttachMoney fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <TextSnippet fontSize="small" sx={{ mr: 1 }} />
                                        Exam Booking Fees
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Paper sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                                                <RadioGroup
                                                    value={examType}
                                                    onChange={(e) => setExamType(e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="ielts-paper"
                                                        control={<Radio color="primary" />}
                                                        label={
                                                            <Box>
                                                                <Typography>IELTS Paper-based</Typography>
                                                                <Typography variant="subtitle2" color="primary">NPR 31,500</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value="ielts-computer"
                                                        control={<Radio color="primary" />}
                                                        label={
                                                            <Box>
                                                                <Typography>IELTS Computer-based</Typography>
                                                                <Typography variant="subtitle2" color="primary">NPR 28,800</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Paper sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                                                <RadioGroup
                                                    value={examType}
                                                    onChange={(e) => setExamType(e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="pte"
                                                        control={<Radio color="primary" />}
                                                        label={
                                                            <Box>
                                                                <Typography>PTE</Typography>
                                                                <Typography variant="subtitle2" color="primary">USD $200</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value="toefl"
                                                        control={<Radio color="primary" />}
                                                        label={
                                                            <Box>
                                                                <Typography>TOEFL iBT</Typography>
                                                                <Typography variant="subtitle2" color="primary">USD $195</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                    {errors.examType && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.examType}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2, bgcolor: 'rgba(79, 70, 229, 0.1)', mt: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1">Subtotal</Typography>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                NPR {(englishClassCost === "" ? 0 : englishClassCost + getExamFee()).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', p: 2, justifyContent: 'space-between' }}>
                            <Button variant="outlined" disabled>
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setActiveTab(1)}
                                endIcon={<ArrowForward />}
                                sx={{ bgcolor: primaryColor }}
                            >
                                Next
                            </Button>
                        </CardActions>
                    </Card>
                </TabPanel>

                {/* Offer Letter Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Card elevation={3}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        mr: 2
                                    }}>
                                        <FileCopy sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h6">Offer Letter</Typography>
                                </Box>
                            }
                            subheader="Application costs for university admission"
                            sx={{
                                bgcolor: `${primaryColor}05`,
                                borderBottom: `1px solid ${primaryColor}20`
                            }}
                        />
                        <CardContent>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <TextField
                                    id="application-cost"
                                    type="number"
                                    value={applicationCost === "" ? "" : applicationCost}
                                    onChange={handleNumberChange(setApplicationCost)}
                                    onWheel={disableScroll}
                                    label="Application Cost (NPR)"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoney fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>

                            <Paper sx={{ p: 2, bgcolor: 'rgba(156, 39, 176, 0.1)', mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Subtotal</Typography>
                                    <Typography variant="h6" color="secondary" fontWeight="bold">
                                        NPR {(applicationCost === "" ? 0 : applicationCost).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Paper>
                        </CardContent>
                        <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', p: 2, justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={() => setActiveTab(0)}>
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setActiveTab(2)}
                                endIcon={<ArrowForward />}
                                sx={{ bgcolor: primaryColor }}
                            >
                                Next
                            </Button>
                        </CardActions>
                    </Card>
                </TabPanel>

                {/* GS Stage Tab */}
                <TabPanel value={activeTab} index={2}>
                    <Card elevation={3}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        mr: 2
                                    }}>
                                        <Apartment sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h6">GS Stage</Typography>
                                </Box>
                            }
                            subheader="Bank loan, documentation, and processing fees"
                            sx={{
                                bgcolor: `${primaryColor}05`,
                                borderBottom: `1px solid ${primaryColor}20`
                            }}
                        />
                        <CardContent>
                            <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                                    <AccountBalance fontSize="small" sx={{ mr: 1 }} />
                                    Bank Loan Details
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.loanAmount}>
                                            <TextField
                                                id="loan-amount"
                                                type="number"
                                                value={loanAmount === "" ? "" : loanAmount}
                                                onChange={handleNumberChange(setLoanAmount)}
                                                onWheel={disableScroll}
                                                label="Bank Loan Amount (NPR)"
                                                error={!!errors.loanAmount}
                                                helperText={errors.loanAmount}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CreditCard fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="processing-rate"
                                                type="number"
                                                value={bankProcessingRate === "" ? "" : bankProcessingRate}
                                                onChange={handleNumberChange(setBankProcessingRate)}
                                                onWheel={disableScroll}
                                                label="Bank Processing Fee (%)"
                                                inputProps={{ step: "0.01" }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoney fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.disbursementAmount}>
                                            <TextField
                                                id="disbursement-amount"
                                                type="number"
                                                value={disbursementAmount === "" ? "" : disbursementAmount}
                                                onChange={handleNumberChange(setDisbursementAmount)}
                                                onWheel={disableScroll}
                                                label="Disbursement Amount (NPR)"
                                                error={!!errors.disbursementAmount}
                                                helperText={errors.disbursementAmount}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoney fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="interest-rate-label">Interest Rate (%)</InputLabel>
                                            <Select
                                                labelId="interest-rate-label"
                                                id="interest-rate"
                                                value={interestRate.toString()}
                                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                                label="Interest Rate (%)"
                                            >
                                                {Array.from({ length: 5 }, (_, i) => i + 8).map((rate) => (
                                                    <MenuItem key={rate} value={rate.toString()}>
                                                        {rate}%
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                                    <TextSnippet fontSize="small" sx={{ mr: 1 }} />
                                    Documentation Costs
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.translationPages}>
                                            <TextField
                                                id="translation-pages"
                                                type="number"
                                                value={translationPages === "" ? "" : translationPages}
                                                onChange={handleNumberChange(setTranslationPages)}
                                                onWheel={disableScroll}
                                                label="Translation Pages"
                                                error={!!errors.translationPages}
                                                helperText={errors.translationPages || "Cost per page: NPR 400"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <TextSnippet fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.notaryPages}>
                                            <TextField
                                                id="notary-pages"
                                                type="number"
                                                value={notaryPages === "" ? "" : notaryPages}
                                                onChange={handleNumberChange(setNotaryPages)}
                                                onWheel={disableScroll}
                                                label="Notary Pages"
                                                error={!!errors.notaryPages}
                                                helperText={errors.notaryPages || "Cost per page: NPR 10"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Gavel fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                                    <Apartment fontSize="small" sx={{ mr: 1 }} />
                                    Engineering Costs
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={bankValuation}
                                                        onChange={(e) => setBankValuation(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography>Bank Property Valuation</Typography>
                                                        <Typography variant="subtitle2" color="primary">NPR 10,000</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={caReport}
                                                        onChange={(e) => setCAReport(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography>CA Report</Typography>
                                                        <Typography variant="subtitle2" color="primary">NPR 2,500</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={propertyValuation}
                                                        onChange={(e) => setPropertyValuation(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography>Property Valuation</Typography>
                                                        <Typography variant="subtitle2" color="primary">NPR 1,500</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                                    <FileCopy fontSize="small" sx={{ mr: 1 }} />
                                    No Objection Letter (NOC)
                                </Typography>
                                <FormControl fullWidth error={!!errors.nocPrograms}>
                                    <InputLabel id="noc-programs-label">Programs</InputLabel>
                                    <Select
                                        labelId="noc-programs-label"
                                        id="noc-programs"
                                        value={nocPrograms.toString()}
                                        onChange={(e) => setNocPrograms(Number(e.target.value))}
                                        label="Programs"
                                    >
                                        <MenuItem value="1">1 Program - NPR 2,000</MenuItem>
                                        <MenuItem value="2">2 Programs - NPR 4,000</MenuItem>
                                    </Select>
                                    {errors.nocPrograms && (
                                        <Typography variant="caption" color="error">
                                            {errors.nocPrograms}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Paper>

                            <Paper sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.15)', mt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Subtotal</Typography>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        NPR {getCategoryTotal("gs").toLocaleString()}
                                    </Typography>
                                </Box>
                            </Paper>
                        </CardContent>
                        <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', p: 2, justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={() => setActiveTab(1)}>
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setActiveTab(3)}
                                endIcon={<ArrowForward />}
                                sx={{ bgcolor: primaryColor }}
                            >
                                Next
                            </Button>
                        </CardActions>
                    </Card>
                </TabPanel>

                {/* COE Stage Tab */}
                <TabPanel value={activeTab} index={3}>
                    <Card elevation={3}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        mr: 2
                                    }}>
                                        <School sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h6">COE Stage</Typography>
                                </Box>
                            }
                            subheader="Tuition fees, taxes, and health insurance"
                            sx={{
                                bgcolor: `${primaryColor}05`,
                                borderBottom: `1px solid ${primaryColor}20`
                            }}
                        />
                        <CardContent>
                            <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'success.main' }}>
                                    <School fontSize="small" sx={{ mr: 1 }} />
                                    Tuition Fee Payment
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.tuitionFee}>
                                            <TextField
                                                id="tuition-fee"
                                                type="number"
                                                value={tuitionFee === "" ? "" : tuitionFee}
                                                onChange={handleNumberChange(setTuitionFee)}
                                                onWheel={disableScroll}
                                                label="Tuition Fee Amount (NPR)"
                                                error={!!errors.tuitionFee}
                                                helperText={errors.tuitionFee}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoney fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="caption" color="success.main">Education Tax (3%)</Typography>
                                                <Typography variant="caption" fontWeight="medium">NPR {getEducationTax().toLocaleString()}</Typography>
                                            </Box>
                                            {loanAmount > 0 && (
                                                <Alert severity="info" sx={{ mt: 2, py: 0.5 }}>
                                                    <Typography variant="caption">
                                                        This will be covered by your bank loan and excluded from the total cost.
                                                    </Typography>
                                                </Alert>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.paymentCompanyFee}>
                                            <TextField
                                                id="payment-company-fee"
                                                type="number"
                                                value={paymentCompanyFee === "" ? "" : paymentCompanyFee}
                                                onChange={handleNumberChange(setPaymentCompanyFee)}
                                                onWheel={disableScroll}
                                                label="Payment Company Fees (NPR)"
                                                error={!!errors.paymentCompanyFee}
                                                helperText={errors.paymentCompanyFee}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CreditCard fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 3, bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'success.main' }}>
                                    <Public fontSize="small" sx={{ mr: 1 }} />
                                    Overseas Student Health Care
                                </Typography>
                                <FormControl fullWidth>
                                    <TextField
                                        id="health-care"
                                        type="number"
                                        value={healthCareCost === "" ? "" : healthCareCost}
                                        onChange={handleNumberChange(setHealthCareCost)}
                                        onWheel={disableScroll}
                                        label="Health Care Cost (AUD)"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoney fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                                        Normally AUD 2,500 depending on stay length
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Typography variant="body2">Equivalent in NPR</Typography>
                                        <Typography variant="body2" fontWeight="medium">NPR {(healthCareCost === "" ? 0 : healthCareCost * 130).toLocaleString()}</Typography>
                                    </Box>
                                </FormControl>
                            </Paper>

                            <Paper sx={{ p: 2, bgcolor: 'rgba(0, 150, 136, 0.15)', mt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Subtotal</Typography>
                                    <Box>
                                        <Typography variant="h6" color="success.main" fontWeight="bold">
                                            NPR {getCategoryTotal("coe").toLocaleString()}
                                        </Typography>
                                        {loanAmount > 0 && (
                                            <Typography variant="caption">(Excluding tuition fee)</Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </CardContent>
                        <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', p: 2, justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={() => setActiveTab(2)}>
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setActiveTab(4)}
                                endIcon={<ArrowForward />}
                                sx={{ bgcolor: primaryColor }}
                            >
                                Next
                            </Button>
                        </CardActions>
                    </Card>
                </TabPanel>

                {/* Visa Stage Tab */}
                <TabPanel value={activeTab} index={4}>
                    <Card elevation={3}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}20`,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        mr: 2
                                    }}>
                                        <Flight sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h6">Visa Stage</Typography>
                                </Box>
                            }
                            subheader="Visa application, biometric, and medical fees"
                            sx={{
                                bgcolor: `${primaryColor}05`,
                                borderBottom: `1px solid ${primaryColor}20`
                            }}
                        />
                        <CardContent>
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, bgcolor: 'rgba(244, 67, 54, 0.05)', minHeight: '200px' }}>
                                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'error.main' }}>
                                            <Gavel fontSize="small" sx={{ mr: 1 }} />
                                            Visa Fees
                                        </Typography>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>AUD 1,610 (Fixed)</Typography>
                                                <Chip
                                                    label="Required"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                        color: 'error.main',
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                <Typography variant="body2">Equivalent in NPR</Typography>
                                                <Typography variant="body2" fontWeight="medium">NPR {(1610 * 90).toLocaleString()}</Typography>
                                            </Box>
                                        </Paper>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, bgcolor: 'rgba(244, 67, 54, 0.05)', minHeight: '200px' }}>
                                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'error.main' }}>
                                            <FileCopy fontSize="small" sx={{ mr: 1 }} />
                                            Biometric
                                        </Typography>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>NPR 3,575 (Fixed)</Typography>
                                                <Chip
                                                    label="Required"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                        color: 'error.main',
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                            </Box>
                                        </Paper>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Paper sx={{ p: 3, bgcolor: 'rgba(244, 67, 54, 0.05)' }}>
                                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'error.main' }}>
                                    <TextSnippet fontSize="small" sx={{ mr: 1 }} />
                                    Medical
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                                            <FormControlLabel
                                                value="Norvic"
                                                control={
                                                    <Radio
                                                        checked={medicalProvider === "Norvic"}
                                                        onChange={(e) => setMedicalProvider(e.target.value)}
                                                        color="error"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography>Norvic</Typography>
                                                        <Typography variant="subtitle2" color="error">NPR 10,000</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                                            <FormControlLabel
                                                value="IOM Nepal"
                                                control={
                                                    <Radio
                                                        checked={medicalProvider === "IOM Nepal"}
                                                        onChange={(e) => setMedicalProvider(e.target.value)}
                                                        color="error"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography>IOM Nepal</Typography>
                                                        <Typography variant="subtitle2" color="error">USD $70</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 2, bgcolor: 'rgba(244, 67, 54, 0.15)', mt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Subtotal</Typography>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        NPR {getCategoryTotal("visa").toLocaleString()}
                                    </Typography>
                                </Box>
                            </Paper>
                        </CardContent>
                        <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', p: 2, justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={() => setActiveTab(3)}>
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                onClick={calculateCosts}
                                disabled={isCalculating}
                                startIcon={isCalculating ? null : <Calculate />}
                                sx={{ bgcolor: primaryColor }}
                            >
                                {isCalculating ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ mr: 1, display: 'inline-block' }}>
                                            <CircularProgress size={16} color="inherit" />
                                        </Box>
                                        Calculating...
                                    </Box>
                                ) : (
                                    "Calculate Total"
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                </TabPanel>
            </Box>

            {showResults && (
                <Card elevation={4} sx={{ mt: 4, bgcolor: `${primaryColor}05`, overflow: 'hidden' }}>
                    <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Description sx={{ mr: 1 }} />
                                <Typography variant="h5">Cost Estimation Results</Typography>
                            </Box>
                        }
                        subheader="Detailed breakdown of your estimated costs for studying abroad"
                        sx={{ bgcolor: primaryColor, color: 'white' }}
                    />
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={6} sm={4} md={2.4}>
                                <Paper sx={{ p: 2, textAlign: 'center', border: `1px solid ${primaryColor}20` }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}10`,
                                        p: 1,
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <MenuBook sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">English Test</Typography>
                                    <Typography variant="h6" color={primaryColor} fontWeight="bold">
                                        NPR {getCategoryTotal("english").toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.4}>
                                <Paper sx={{ p: 2, textAlign: 'center', border: `1px solid ${primaryColor}20` }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}10`,
                                        p: 1,
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <FileCopy sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">Offer Letter</Typography>
                                    <Typography variant="h6" color={primaryColor} fontWeight="bold">
                                        NPR {getCategoryTotal("offer").toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.4}>
                                <Paper sx={{ p: 2, textAlign: 'center', border: `1px solid ${primaryColor}20` }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}10`,
                                        p: 1,
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <Apartment sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">GS Stage</Typography>
                                    <Typography variant="h6" color={primaryColor} fontWeight="bold">
                                        NPR {getCategoryTotal("gs").toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.4}>
                                <Paper sx={{ p: 2, textAlign: 'center', border: `1px solid ${primaryColor}20` }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}10`,
                                        p: 1,
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <School sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">COE Stage</Typography>
                                    <Typography variant="h6" color={primaryColor} fontWeight="bold">
                                        NPR {getCategoryTotal("coe").toLocaleString()}
                                    </Typography>
                                    {loanAmount > 0 && (
                                        <Typography variant="caption" color="text.secondary">(Excl. tuition)</Typography>
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.4}>
                                <Paper sx={{ p: 2, textAlign: 'center', border: `1px solid ${primaryColor}20` }}>
                                    <Box sx={{
                                        bgcolor: `${primaryColor}10`,
                                        p: 1,
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <Flight sx={{ color: primaryColor }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">Visa Stage</Typography>
                                    <Typography variant="h6" color={primaryColor} fontWeight="bold">
                                        NPR {getCategoryTotal("visa").toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        <TableContainer component={Paper} sx={{ mb: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell width="180px">Category</TableCell>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Cost (NPR)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* English Proficiency */}
                                    <TableRow sx={{ bgcolor: 'rgba(79, 70, 229, 0.05)' }}>
                                        <TableCell rowSpan={2} sx={{ fontWeight: 'medium', color: 'indigo.700', borderRight: '1px solid rgba(79, 70, 229, 0.2)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <MenuBook fontSize="small" sx={{ mr: 1 }} />
                                                English Proficiency
                                            </Box>
                                        </TableCell>
                                        <TableCell>Class Cost</TableCell>
                                        <TableCell align="right">{(englishClassCost === "" ? 0 : englishClassCost).toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(79, 70, 229, 0.05)' }}>
                                        <TableCell>Exam Fee</TableCell>
                                        <TableCell align="right">{getExamFee().toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Offer Letter */}
                                    <TableRow sx={{ bgcolor: 'rgba(156, 39, 176, 0.05)' }}>
                                        <TableCell sx={{ fontWeight: 'medium', color: 'secondary.main', borderRight: '1px solid rgba(156, 39, 176, 0.2)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <FileCopy fontSize="small" sx={{ mr: 1 }} />
                                                Offer Letter
                                            </Box>
                                        </TableCell>
                                        <TableCell>Application Cost</TableCell>
                                        <TableCell align="right">{(applicationCost === "" ? 0 : applicationCost).toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* GS Stage */}
                                    <TableRow sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                        <TableCell rowSpan={5} sx={{ fontWeight: 'medium', color: 'primary.main', borderRight: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Apartment fontSize="small" sx={{ mr: 1 }} />
                                                GS Stage
                                            </Box>
                                        </TableCell>
                                        <TableCell>Bank Processing Fee ({bankProcessingRate === "" ? 0 : bankProcessingRate}%)</TableCell>
                                        <TableCell align="right">{getBankProcessingFee().toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                        <TableCell>Translation ({translationPages === "" ? 0 : translationPages} pages)</TableCell>
                                        <TableCell align="right">{getTranslationCost().toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                        <TableCell>Notary ({notaryPages === "" ? 0 : notaryPages} pages)</TableCell>
                                        <TableCell align="right">{getNotaryCost().toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                        <TableCell>Engineering Costs</TableCell>
                                        <TableCell align="right">{getEngineeringCost().toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                                        <TableCell>NOC ({nocPrograms} programs)</TableCell>
                                        <TableCell align="right">{getNocCost().toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* COE Stage */}
                                    <TableRow sx={{ bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                                        <TableCell rowSpan={4} sx={{ fontWeight: 'medium', color: 'success.main', borderRight: '1px solid rgba(0, 150, 136, 0.2)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <School fontSize="small" sx={{ mr: 1 }} />
                                                COE Stage
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            Tuition Fee
                                            {loanAmount > 0 && (
                                                <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                                                    (Covered by loan)
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">{(tuitionFee === "" ? 0 : tuitionFee).toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                                        <TableCell>
                                            Education Tax (3%)
                                            {loanAmount > 0 && (
                                                <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                                                    (Covered by loan)
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">{getEducationTax().toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                                        <TableCell>Payment Company Fee</TableCell>
                                        <TableCell align="right">{(paymentCompanyFee === "" ? 0 : paymentCompanyFee).toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                                        <TableCell>Health Care</TableCell>
                                        <TableCell align="right">{(healthCareCost === "" ? 0 : healthCareCost * 130).toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Visa Stage */}
                                    <TableRow sx={{ bgcolor: 'rgba(244, 67, 54, 0.05)' }}>
                                        <TableCell rowSpan={3} sx={{ fontWeight: 'medium', color: 'error.main', borderRight: '1px solid rgba(244, 67, 54, 0.2)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Flight fontSize="small" sx={{ mr: 1 }} />
                                                Visa Stage
                                            </Box>
                                        </TableCell>
                                        <TableCell>Visa Fee (AUD 1,610)</TableCell>
                                        <TableCell align="right">{(1610 * 90).toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(244, 67, 54, 0.05)' }}>
                                        <TableCell>Biometric</TableCell>
                                        <TableCell align="right">3,575</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ bgcolor: 'rgba(244, 67, 54, 0.05)' }}>
                                        <TableCell>Medical ({medicalProvider === "Norvic" ? "Norvic" : "IOM Nepal"})</TableCell>
                                        <TableCell align="right">{getMedicalCost().toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Total */}
                                    <TableRow sx={{ bgcolor: `${primaryColor}10` }}>
                                        <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            TOTAL ESTIMATED COST
                                            {loanAmount > 0 && (
                                                <Typography component="span" variant="body2" fontWeight="normal" sx={{ ml: 1 }}>
                                                    (Excluding tuition fee)
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: primaryColor }}>
                                            NPR {getTotalCost().toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {disbursementAmount > 0 && (
                            <Alert
                                severity="info"
                                sx={{
                                    mb: 3,
                                    border: '1px solid rgba(33, 150, 243, 0.2)',
                                    bgcolor: 'rgba(33, 150, 243, 0.05)'
                                }}
                            >
                                <AlertTitle>Loan Information</AlertTitle>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <Typography variant="caption" color="primary">Disbursement Amount</Typography>
                                            <Typography variant="subtitle1" fontWeight="bold">NPR {(disbursementAmount === "" ? 0 : disbursementAmount).toLocaleString()}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <Typography variant="caption" color="primary">Interest Rate</Typography>
                                            <Typography variant="subtitle1" fontWeight="bold">{interestRate}%</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                                            <Typography variant="caption" color="primary">Monthly EMI</Typography>
                                            <Typography variant="subtitle1" fontWeight="bold">NPR {getMonthlyInstallment().toLocaleString()}</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Alert>
                        )}
                    </CardContent>
                    <CardActions sx={{
                        p: 3,
                        bgcolor: 'background.paper',
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                        background: 'linear-gradient(to right, rgba(79, 70, 229, 0.05), rgba(156, 39, 176, 0.05))'
                    }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => generateReport({
                                englishClassCost,
                                examType,
                                getExamFee,
                                applicationCost,
                                loanAmount,
                                bankProcessingRate,
                                getBankProcessingFee,
                                disbursementAmount,
                                interestRate,
                                translationPages,
                                getTranslationCost,
                                notaryPages,
                                getNotaryCost,
                                bankValuation,
                                caReport,
                                propertyValuation,
                                getEngineeringCost,
                                nocPrograms,
                                getNocCost,
                                tuitionFee,
                                getEducationTax,
                                paymentCompanyFee,
                                healthCareCost,
                                medicalProvider,
                                getMedicalCost,
                                getTotalCost,
                                getCategoryTotal,
                                getMonthlyInstallment,
                            })}
                            startIcon={<GetApp />}
                            sx={{ bgcolor: primaryColor }}
                        >
                            Download Detailed Report
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Container>
    );
}