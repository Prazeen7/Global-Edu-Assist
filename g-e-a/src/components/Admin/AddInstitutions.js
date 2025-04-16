import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme,
    InputLabel,
} from "@mui/material";
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
} from "@mui/icons-material";

export default function AddInstitution({ onClose }) {
    const theme = useTheme();

    // State for basic information
    const [institutionName, setInstitutionName] = useState("");
    const [institutionType, setInstitutionType] = useState("university");
    const [profilePicture, setProfilePicture] = useState({
        file: null,
        preview: null,
    });
    const [bannerImages, setBannerImages] = useState([]);
    const [bannerError, setBannerError] = useState(""); // Error state for banner images
    const MAX_BANNER_IMAGES = 5; // Maximum allowed banner images

    // State for overview
    const [overviewHeading, setOverviewHeading] = useState("");
    const [overviewDetails, setOverviewDetails] = useState("");

    // State for locations
    const [locations, setLocations] = useState([]);

    // State for application fee
    const [applicationFee, setApplicationFee] = useState("");

    // State for entry requirements
    const [undergraduateGPA, setUndergraduateGPA] = useState("");
    const [undergraduateIELTS, setUndergraduateIELTS] = useState("");
    const [undergraduatePTE, setUndergraduatePTE] = useState("");
    const [undergraduateTOEFL, setUndergraduateTOEFL] = useState("");
    const [postgraduateGPA, setPostgraduateGPA] = useState("");
    const [postgraduateIELTS, setPostgraduateIELTS] = useState("");
    const [postgraduatePTE, setPostgraduatePTE] = useState("");
    const [postgraduateTOEFL, setPostgraduateTOEFL] = useState("");

    // State for agents
    const [agents, setAgents] = useState([]);

    // State for programs
    const [programs, setPrograms] = useState([]);

    // State for scholarships
    const [scholarships, setScholarships] = useState([]);

    // State for documents
    const [incomeSources, setIncomeSources] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [minSponsorCount, setMinSponsorCount] = useState("");
    const [minIncomeAmount, setMinIncomeAmount] = useState("");
    const [banks, setBanks] = useState([]);
    const [previousVisaRefusal, setPreviousVisaRefusal] = useState("no");
    const [levelChangeAfterRefusal, setLevelChangeAfterRefusal] = useState(false);

    // Handler for profile picture upload
    const handleProfilePictureUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setProfilePicture({
                file: file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    // Handler for removing profile picture
    const handleRemoveProfilePicture = () => {
        setProfilePicture({
            file: null,
            preview: null,
        });
    };

    // Handler for banner images upload
    const handleBannerImagesUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const files = Array.from(event.target.files);

            // Check image limit
            if (bannerImages.length + files.length > MAX_BANNER_IMAGES) {
                setBannerError(`Maximum ${MAX_BANNER_IMAGES} banner images allowed`);
                return;
            }

            // Reset error if valid
            setBannerError("");

            const newBannerImages = files.map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));
            setBannerImages([...bannerImages, ...newBannerImages]);
        }
    };

    // Handler for adding a location
    const handleAddLocation = () => {
        setLocations([...locations, { id: Date.now(), campusName: "", country: "", city: "", address: "" }]);
    };

    // Handler for removing a location
    const handleRemoveLocation = (id) => {
        setLocations(locations.filter((location) => location.id !== id));
    };

    // Handler for changing location details
    const handleLocationChange = (id, field, value) => {
        setLocations(
            locations.map((location) =>
                location.id === id ? { ...location, [field]: value } : location
            )
        );
    };

    // Handler for adding an agent
    const handleAddAgent = () => {
        setAgents([...agents, { id: Date.now(), name: "" }]);
    };

    // Handler for changing agent details
    const handleAgentChange = (id, value) => {
        setAgents(
            agents.map((agent) =>
                agent.id === id ? { ...agent, name: value } : agent
            )
        );
    };

    // Handler for removing an agent
    const handleRemoveAgent = (id) => {
        setAgents(agents.filter((agent) => agent.id !== id));
    };

    // Handler for adding a program
    const handleAddProgram = () => {
        setPrograms([...programs, { id: Date.now(), name: "", level: "", url: "", duration: "", intakes: "", firstYearFees: "", cricosCode: "", discipline: "", campuses: "", fundsRequired: "", ielts: "", pte: "", toefl: "" }]);
    };

    // Handler for changing program details
    const handleProgramChange = (id, field, value) => {
        setPrograms(
            programs.map((program) =>
                program.id === id ? { ...program, [field]: value } : program
            )
        );
    };

    // Handler for removing a program
    const handleRemoveProgram = (id) => {
        setPrograms(programs.filter((program) => program.id !== id));
    };

    // Handler for adding a scholarship
    const handleAddScholarship = () => {
        setScholarships([...scholarships, { id: Date.now(), name: "", link: "" }]);
    };

    // Handler for changing scholarship details
    const handleScholarshipChange = (id, field, value) => {
        setScholarships(
            scholarships.map((scholarship) =>
                scholarship.id === id ? { ...scholarship, [field]: value } : scholarship
            )
        );
    };

    // Handler for removing a scholarship
    const handleRemoveScholarship = (id) => {
        setScholarships(scholarships.filter((scholarship) => scholarship.id !== id));
    };

    // Handler for adding an income source
    const handleAddIncomeSource = () => {
        setIncomeSources([...incomeSources, { id: Date.now(), name: "" }]);
    };

    // Handler for changing income source details
    const handleIncomeSourceChange = (id, value) => {
        setIncomeSources(
            incomeSources.map((source) =>
                source.id === id ? { ...source, name: value } : source
            )
        );
    };

    // Handler for removing an income source
    const handleRemoveIncomeSource = (id) => {
        setIncomeSources(incomeSources.filter((source) => source.id !== id));
    };

    // Handler for adding a sponsor
    const handleAddSponsor = () => {
        setSponsors([...sponsors, { id: Date.now(), name: "" }]);
    };

    // Handler for changing sponsor details
    const handleSponsorChange = (id, value) => {
        setSponsors(
            sponsors.map((sponsor) =>
                sponsor.id === id ? { ...sponsor, name: value } : sponsor
            )
        );
    };

    // Handler for removing a sponsor
    const handleRemoveSponsor = (id) => {
        setSponsors(sponsors.filter((sponsor) => sponsor.id !== id));
    };

    // Handler for adding a bank
    const handleAddBank = () => {
        setBanks([...banks, { id: Date.now(), name: "" }]);
    };

    // Handler for changing bank details
    const handleBankChange = (id, value) => {
        setBanks(
            banks.map((bank) =>
                bank.id === id ? { ...bank, name: value } : bank
            )
        );
    };

    // Handler for removing a bank
    const handleRemoveBank = (id) => {
        setBanks(banks.filter((bank) => bank.id !== id));
    };

    // Handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Frontend validation
        if (!institutionName || !institutionType) {
            alert("Institution name and type are required");
            return;
        }

        if (bannerImages.length > MAX_BANNER_IMAGES) {
            setBannerError(`Maximum ${MAX_BANNER_IMAGES} banner images allowed`);
            return;
        }

        // Validate profile picture if exists
        if (profilePicture.file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(profilePicture.file.type)) {
                alert('Profile picture must be a JPEG/PNG/JPG image');
                return;
            }
            if (profilePicture.file.size > 5 * 1024 * 1024) {
                alert('Profile picture is too large. Maximum 5MB allowed');
                return;
            }
        }

        // Validate banner images if exist
        for (const image of bannerImages) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(image.file.type)) {
                alert('Banner images must be JPEG/PNG/JPG format');
                return;
            }
            if (image.file.size > 5 * 1024 * 1024) {
                alert('One or more banner images are too large. Maximum 5MB allowed');
                return;
            }
        }

        // Create FormData object
        const formData = new FormData();

        // Append files with correct field names
        if (profilePicture.file) {
            formData.append("profilePicture", profilePicture.file);
        }

        bannerImages.forEach((image) => {
            formData.append("bannerImages", image.file);
        });

        // Append other fields
        formData.append("institutionName", institutionName);
        formData.append("institutionType", institutionType);
        formData.append("overviewHeading", overviewHeading);
        formData.append("overviewDetails", overviewDetails);
        formData.append("applicationFee", applicationFee);
        formData.append("undergraduateGPA", undergraduateGPA);
        formData.append("undergraduateIELTS", undergraduateIELTS);
        formData.append("undergraduatePTE", undergraduatePTE);
        formData.append("undergraduateTOEFL", undergraduateTOEFL);
        formData.append("postgraduateGPA", postgraduateGPA);
        formData.append("postgraduateIELTS", postgraduateIELTS);
        formData.append("postgraduatePTE", postgraduatePTE);
        formData.append("postgraduateTOEFL", postgraduateTOEFL);
        formData.append("minSponsorCount", minSponsorCount);
        formData.append("minIncomeAmount", minIncomeAmount);
        formData.append("previousVisaRefusal", previousVisaRefusal);
        formData.append("levelChangeAfterRefusal", levelChangeAfterRefusal);

        // Append JSON stringified fields
        formData.append("locations", JSON.stringify(locations));
        formData.append("programs", JSON.stringify(programs));
        formData.append("scholarships", JSON.stringify(scholarships));
        formData.append("agents", JSON.stringify(agents.map(agent => agent.name)));
        formData.append("incomeSources", JSON.stringify(incomeSources.map(source => source.name)));
        formData.append("sponsors", JSON.stringify(sponsors.map(sponsor => sponsor.name)));
        formData.append("banks", JSON.stringify(banks.map(bank => bank.name)));

        try {
            const response = await fetch("http://localhost:3001/api/institutions", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add institution");
            }

            const data = await response.json();
            console.log("Institution added successfully:", data);
            alert("Institution added successfully!");

            // Clear the form after successful submission
            setInstitutionName("");
            setInstitutionType("university");
            setProfilePicture({ file: null, preview: null });
            setBannerImages([]);
            setBannerError("");
            setOverviewHeading("");
            setOverviewDetails("");
            setLocations([]);
            setApplicationFee("");
            setUndergraduateGPA("");
            setUndergraduateIELTS("");
            setUndergraduatePTE("");
            setUndergraduateTOEFL("");
            setPostgraduateGPA("");
            setPostgraduateIELTS("");
            setPostgraduatePTE("");
            setPostgraduateTOEFL("");
            setAgents([]);
            setPrograms([]);
            setScholarships([]);
            setIncomeSources([]);
            setSponsors([]);
            setMinSponsorCount("");
            setMinIncomeAmount("");
            setBanks([]);
            setPreviousVisaRefusal("no");
            setLevelChangeAfterRefusal(false);

        } catch (error) {
            console.error("Error adding institution:", error);
            // Show more specific error messages
            if (error.message.includes("Invalid file type")) {
                alert("Upload error: " + error.message);
            } else if (error.message.includes("File size too large")) {
                alert("Upload error: " + error.message);
            } else {
                alert(error.message || "Failed to add institution. Please try again.");
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Add Institution
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Create a new educational institution in the system
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={onClose}
                >
                    Back to Institutions
                </Button>
            </Box>

            {/* Form Content */}
            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                    {/* Basic Information */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Basic Information
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                label="Institution Name"
                                fullWidth
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                                placeholder="e.g. Australian Catholic University"
                                required
                            />

                            <FormControl component="fieldset">
                                <Typography variant="subtitle2" gutterBottom>
                                    Institution Type
                                </Typography>
                                <RadioGroup
                                    name="institution-type"
                                    value={institutionType}
                                    onChange={(e) => setInstitutionType(e.target.value)}
                                    row
                                >
                                    <FormControlLabel
                                        value="university"
                                        control={<Radio />}
                                        label="University"
                                        sx={{ cursor: "pointer" }}
                                    />
                                    <FormControlLabel
                                        value="private"
                                        control={<Radio />}
                                        label="Private Higher Education Provider"
                                        sx={{ cursor: "pointer" }}
                                    />
                                </RadioGroup>
                            </FormControl>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Profile Picture
                                </Typography>
                                <Box
                                    sx={{
                                        border: "1px dashed grey",
                                        borderRadius: 1,
                                        p: 2,
                                        textAlign: "center",
                                        height: 150,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundImage: profilePicture.preview ? `url(${profilePicture.preview})` : "none",
                                        backgroundSize: "contain",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        position: "relative"
                                    }}
                                >
                                    {profilePicture.preview ? (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                bgcolor: "rgba(255,255,255,0.7)"
                                            }}
                                            onClick={handleRemoveProfilePicture}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    ) : (
                                        <>
                                            <input
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                id="profile-picture-upload"
                                                type="file"
                                                onChange={handleProfilePictureUpload}
                                            />
                                            <label htmlFor="profile-picture-upload">
                                                <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                                                    Upload Logo
                                                </Button>
                                            </label>
                                            <Typography variant="caption" sx={{ mt: 1 }}>
                                                Drag and drop or click to upload logo
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                (Recommended: 400x400px, PNG or JPG)
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Banner Images
                                </Typography>
                                {bannerError && (
                                    <Typography variant="caption" color="error" sx={{ mb: 1 }}>
                                        {bannerError}
                                    </Typography>
                                )}
                                <Grid container spacing={1}>
                                    {bannerImages.map((image, index) => (
                                        <Grid item xs={4} key={index}>
                                            <Box
                                                sx={{
                                                    border: '1px solid grey',
                                                    borderRadius: 1,
                                                    height: 100,
                                                    backgroundImage: image.preview ? `url(${image.preview})` : "none",
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    position: 'relative'
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 5,
                                                        right: 5,
                                                        bgcolor: 'rgba(255,255,255,0.7)'
                                                    }}
                                                    onClick={() => setBannerImages(bannerImages.filter((_, i) => i !== index))}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                    <Grid item xs={4}>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="banner-image-upload"
                                            type="file"
                                            onChange={handleBannerImagesUpload}
                                            multiple // Allow multiple files
                                        />
                                        <label htmlFor="banner-image-upload">
                                            <Box
                                                sx={{
                                                    border: '1px dashed grey',
                                                    borderRadius: 1,
                                                    p: 2,
                                                    height: 100,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                    }
                                                }}
                                            >
                                                <AddIcon />
                                                <Typography variant="caption" align="center">
                                                    Add banner image
                                                </Typography>
                                            </Box>
                                        </label>
                                    </Grid>
                                </Grid>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    (Recommended: 1600x400px, PNG or JPG)
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Overview */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Overview
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                label="Heading"
                                fullWidth
                                value={overviewHeading}
                                onChange={(e) => setOverviewHeading(e.target.value)}
                                placeholder="e.g. About Australian Catholic University"
                            />
                            <TextField
                                label="Details"
                                fullWidth
                                multiline
                                rows={6}
                                value={overviewDetails}
                                onChange={(e) => setOverviewDetails(e.target.value)}
                                placeholder="Enter institution overview..."
                            />
                        </Stack>
                    </Paper>

                    {/* Locations */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6">Locations</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddLocation}>
                                Add Location
                            </Button>
                        </Box>

                        {locations.map((location, index) => (
                            <Card key={location.id} sx={{ mb: 2, position: "relative" }}>
                                <CardContent>
                                    <IconButton
                                        size="small"
                                        sx={{ position: "absolute", top: 8, right: 8 }}
                                        onClick={() => handleRemoveLocation(location.id)}
                                        disabled={locations.length === 1}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>

                                    <Typography variant="subtitle2" gutterBottom>
                                        Location #{index + 1}
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Campus Name"
                                                fullWidth
                                                value={location.campusName}
                                                onChange={(e) => handleLocationChange(location.id, "campusName", e.target.value)}
                                                placeholder="e.g. North Sydney Campus"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Country"
                                                fullWidth
                                                value={location.country}
                                                onChange={(e) => handleLocationChange(location.id, "country", e.target.value)}
                                                placeholder="e.g. Australia"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="City"
                                                fullWidth
                                                value={location.city}
                                                onChange={(e) => handleLocationChange(location.id, "city", e.target.value)}
                                                placeholder="e.g. Sydney"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Address"
                                                fullWidth
                                                value={location.address}
                                                onChange={(e) => handleLocationChange(location.id, "address", e.target.value)}
                                                placeholder="Full address"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>

                    {/* Application Fee */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Application Fee
                        </Typography>
                        <TextField
                            label="Fee Amount"
                            fullWidth
                            value={applicationFee}
                            onChange={(e) => setApplicationFee(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            placeholder="0.00"
                        />
                    </Paper>

                    {/* Entry Requirements */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Entry Requirements
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Undergraduate
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="GPA"
                                        fullWidth
                                        value={undergraduateGPA}
                                        onChange={(e) => setUndergraduateGPA(e.target.value)}
                                        placeholder="e.g. 3.0/4.0"
                                        size="small"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Language Requirements
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="IELTS"
                                                fullWidth
                                                value={undergraduateIELTS}
                                                onChange={(e) => setUndergraduateIELTS(e.target.value)}
                                                placeholder="e.g. 6.5/6.0"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="PTE"
                                                fullWidth
                                                value={undergraduatePTE}
                                                onChange={(e) => setUndergraduatePTE(e.target.value)}
                                                placeholder="e.g. 58/50"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="TOEFL"
                                                fullWidth
                                                value={undergraduateTOEFL}
                                                onChange={(e) => setUndergraduateTOEFL(e.target.value)}
                                                placeholder="e.g. 90"
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Postgraduate
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="GPA"
                                        fullWidth
                                        value={postgraduateGPA}
                                        onChange={(e) => setPostgraduateGPA(e.target.value)}
                                        placeholder="e.g. 3.0/4.0"
                                        size="small"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Language Requirements
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="IELTS"
                                                fullWidth
                                                value={postgraduateIELTS}
                                                onChange={(e) => setPostgraduateIELTS(e.target.value)}
                                                placeholder="e.g. 6.5/6.0"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="PTE"
                                                fullWidth
                                                value={postgraduatePTE}
                                                onChange={(e) => setPostgraduatePTE(e.target.value)}
                                                placeholder="e.g. 58/50"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="TOEFL"
                                                fullWidth
                                                value={postgraduateTOEFL}
                                                onChange={(e) => setPostgraduateTOEFL(e.target.value)}
                                                placeholder="e.g. 90"
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Agents */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6">Agents</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddAgent}>
                                Add Agent
                            </Button>
                        </Box>

                        {agents.map((agent, index) => (
                            <Box key={agent.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label={`Agent #${index + 1}`}
                                    value={agent.name}
                                    onChange={(e) => handleAgentChange(agent.id, e.target.value)}
                                    placeholder="e.g. Global Education Consultants"
                                    size="small"
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveAgent(agent.id)}
                                    disabled={agents.length === 1}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                    {/* Programs */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6">Programs</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddProgram}>
                                Add Program
                            </Button>
                        </Box>

                        {programs.map((program, index) => (
                            <Card key={program.id} sx={{ mb: 2, position: "relative" }}>
                                <CardContent>
                                    <IconButton
                                        size="small"
                                        sx={{ position: "absolute", top: 8, right: 8 }}
                                        onClick={() => handleRemoveProgram(program.id)}
                                        disabled={programs.length === 1}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>

                                    <Typography variant="subtitle2" gutterBottom>
                                        Program #{index + 1}
                                    </Typography>

                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={8}>
                                            <TextField
                                                label="Program Name"
                                                fullWidth
                                                value={program.name}
                                                onChange={(e) => handleProgramChange(program.id, "name", e.target.value)}
                                                placeholder="e.g. Bachelor of Applied Public Health (Honours)"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel id={`level-label-${program.id}`}>Level</InputLabel>
                                                <Select
                                                    labelId={`level-label-${program.id}`}
                                                    value={program.level}
                                                    onChange={(e) => handleProgramChange(program.id, "level", e.target.value)}
                                                    label="Level"
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 300
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">Select level</MenuItem>
                                                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                                                    <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                                                    <MenuItem value="Diploma">Diploma</MenuItem>
                                                    <MenuItem value="Certificate">Certificate</MenuItem>
                                                    <MenuItem value="PhD">PhD</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="URL"
                                                fullWidth
                                                value={program.url}
                                                onChange={(e) => handleProgramChange(program.id, "url", e.target.value)}
                                                placeholder="Program website URL"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Duration"
                                                fullWidth
                                                value={program.duration}
                                                onChange={(e) => handleProgramChange(program.id, "duration", e.target.value)}
                                                placeholder="e.g. 1 year"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Intakes"
                                                fullWidth
                                                value={program.intakes}
                                                onChange={(e) => handleProgramChange(program.id, "intakes", e.target.value)}
                                                placeholder="e.g. February 2025, July 2025"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="First Year Fees"
                                                fullWidth
                                                value={program.firstYearFees}
                                                onChange={(e) => handleProgramChange(program.id, "firstYearFees", e.target.value)}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                placeholder="0.00"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="CRICOS Code"
                                                fullWidth
                                                value={program.cricosCode}
                                                onChange={(e) => handleProgramChange(program.id, "cricosCode", e.target.value)}
                                                placeholder="e.g. 090703A"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Discipline"
                                                fullWidth
                                                value={program.discipline}
                                                onChange={(e) => handleProgramChange(program.id, "discipline", e.target.value)}
                                                placeholder="e.g. Public Health"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Campuses"
                                                fullWidth
                                                value={program.campuses}
                                                onChange={(e) => handleProgramChange(program.id, "campuses", e.target.value)}
                                                placeholder="e.g. Melbourne, Sydney"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Funds Required"
                                                fullWidth
                                                value={program.fundsRequired}
                                                onChange={(e) => handleProgramChange(program.id, "fundsRequired", e.target.value)}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">AUD</InputAdornment>,
                                                }}
                                                placeholder="0"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Language Requirements
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="IELTS"
                                                        fullWidth
                                                        value={program.ielts}
                                                        onChange={(e) => handleProgramChange(program.id, "ielts", e.target.value)}
                                                        placeholder="e.g. 6.5/6.0"
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="PTE"
                                                        fullWidth
                                                        value={program.pte}
                                                        onChange={(e) => handleProgramChange(program.id, "pte", e.target.value)}
                                                        placeholder="e.g. 58/50"
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="TOEFL"
                                                        fullWidth
                                                        value={program.toefl}
                                                        onChange={(e) => handleProgramChange(program.id, "toefl", e.target.value)}
                                                        placeholder="e.g. 90"
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>

                    {/* Scholarships */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6">Scholarships</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddScholarship}>
                                Add Scholarship
                            </Button>
                        </Box>

                        {scholarships.map((scholarship, index) => (
                            <Card key={scholarship.id} sx={{ mb: 2, position: "relative" }}>
                                <CardContent>
                                    <IconButton
                                        size="small"
                                        sx={{ position: "absolute", top: 8, right: 8 }}
                                        onClick={() => handleRemoveScholarship(scholarship.id)}
                                        disabled={scholarships.length === 1}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>

                                    <Typography variant="subtitle2" gutterBottom>
                                        Scholarship #{index + 1}
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Scholarship Name"
                                                fullWidth
                                                value={scholarship.name}
                                                onChange={(e) => handleScholarshipChange(scholarship.id, "name", e.target.value)}
                                                placeholder="e.g. International Student Scholarship"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Scholarship Link"
                                                fullWidth
                                                value={scholarship.link}
                                                onChange={(e) => handleScholarshipChange(scholarship.id, "link", e.target.value)}
                                                placeholder="Scholarship website URL"
                                                size="small"
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>

                    {/* Documents */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Documents
                        </Typography>

                        {/* Acceptable Income Sources */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Acceptable Income Sources</Typography>
                                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddIncomeSource}>
                                    Add
                                </Button>
                            </Box>

                            {incomeSources.map((source, index) => (
                                <Box key={source.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id={`income-source-label-${source.id}`}>Income Source</InputLabel>
                                        <Select
                                            labelId={`income-source-label-${source.id}`}
                                            id={`income-source-${source.id}`}
                                            value={source.name}
                                            onChange={(e) => handleIncomeSourceChange(source.id, e.target.value)}
                                            label="Income Source"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300
                                                    }
                                                }
                                            }}
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
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveIncomeSource(source.id)}
                                        disabled={incomeSources.length === 1}
                                        sx={{ ml: 1 }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        {/* Acceptable Sponsors */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Acceptable Sponsors</Typography>
                                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddSponsor}>
                                    Add
                                </Button>
                            </Box>

                            {sponsors.map((sponsor, index) => (
                                <Box key={sponsor.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id={`sponsor-label-${sponsor.id}`}>Sponsor</InputLabel>
                                        <Select
                                            labelId={`sponsor-label-${sponsor.id}`}
                                            id={`sponsor-${sponsor.id}`}
                                            value={sponsor.name}
                                            onChange={(e) => handleSponsorChange(sponsor.id, e.target.value)}
                                            label="Sponsor"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300
                                                    }
                                                }
                                            }}
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
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveSponsor(sponsor.id)}
                                        disabled={sponsors.length === 1}
                                        sx={{ ml: 1 }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        {/* Minimum Sponsor Count */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                label="Minimum Sponsor Count"
                                fullWidth
                                value={minSponsorCount}
                                onChange={(e) => setMinSponsorCount(e.target.value)}
                                placeholder="e.g. 1"
                                size="small"
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                        </Box>

                        {/* Minimum Income Amount Required */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                label="Minimum Income Amount Required"
                                fullWidth
                                value={minIncomeAmount}
                                onChange={(e) => setMinIncomeAmount(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                placeholder="0.00"
                                size="small"
                            />
                        </Box>

                        {/* Acceptable Banks */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Acceptable Banks</Typography>
                                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddBank}>
                                    Add
                                </Button>
                            </Box>

                            {banks.map((bank, index) => (
                                <Box key={bank.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        value={bank.name}
                                        onChange={(e) => handleBankChange(bank.id, e.target.value)}
                                        placeholder={`Bank #${index + 1}`}
                                        size="small"
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveBank(bank.id)}
                                        disabled={banks.length === 1}
                                        sx={{ ml: 1 }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        {/* Previous Visa Refusal */}
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Previous Visa Refusal
                            </Typography>
                            <RadioGroup
                                value={previousVisaRefusal}
                                onChange={(e) => {
                                    setPreviousVisaRefusal(e.target.value);
                                }}
                                row
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio />}
                                    label="Yes"
                                    sx={{ cursor: 'pointer' }}
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio />}
                                    label="No"
                                    sx={{ cursor: 'pointer' }}
                                />
                            </RadioGroup>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="level-change-checkbox"
                                        checked={levelChangeAfterRefusal}
                                        onChange={(e) => setLevelChangeAfterRefusal(e.target.checked)}
                                    />
                                }
                                label="There is a change in level of study (e.g., UG to PG) compared to the previous refusal"
                                sx={{ cursor: 'pointer' }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained" color="primary" type="submit">
                    Save Institution
                </Button>
            </Box>
        </Box>
    );
}