import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Input,
    Select,
    Option,
    Button,
    Divider,
    Chip,
    CircularProgress,
    Avatar,
    Sheet,
} from "@mui/joy";
import { Search, FilterList, LocationOn, School, AccessTime, ArrowForward } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './institutions.css'

export default function InstitutionsPage() {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("all"); // Default to "all" locations
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); // Default to page 1

    const brandColor = "#4f46e5";

    // Helper function to extract months from intakes
    const extractMonths = (intakes) => {
        if (!intakes) return "N/A"; // Handle missing data
        const months = intakes
            .split(",") // Split by comma
            .map((intake) => intake.trim().split(" ")[0]) // Extract the month
            .filter((month, index, self) => self.indexOf(month) === index); // Remove duplicates
        return months.join(", "); // Join with commas
    };

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/institutions", {
                    params: {
                        search: searchQuery,
                        location: selectedLocation,
                    },
                });
                setInstitutions(response.data);
                setError(null); // Clear any previous errors
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setInstitutions([]); // Clear institutions list
                    setError([
                        "No institutions found matching your criteria.",
                        "Try adjusting your search or filters to see more results.",
                    ]);
                } else {
                    setError("Failed to fetch institutions. Please try again later.");
                }
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [searchQuery, selectedLocation, currentPage]);

    // Learn more navigation
    const institutionsCheck = (institution) => {
        navigate(`/institutionPage/${institution._id}`, { state: institution });
    };

    // Helper function to handle missing data
    const getValue = (value, fallback = "N/A") => {
        return value || fallback;
    };

    return (
        <Box sx={{ width: "100%", margin: "0 auto", p: 3 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h1" sx={{ mb: 1, color: brandColor, fontSize: "2rem" }}>
                    Find Your Perfect Institution
                </Typography>
                <Typography level="body-lg" color="neutral" fontSize="0.875rem">
                    Browse through our curated list of top educational institutions worldwide
                </Typography>
            </Box>

            {/* Search and Filter Section */}
            <Sheet
                variant="outlined"
                sx={{
                    mb: 4,
                    p: 2,
                    borderRadius: "lg",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    width: "100%",
                }}
            >
                <Input
                    startDecorator={<Search />}
                    placeholder="Search institutions..."
                    sx={{ flex: 1 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                    placeholder="Select location"
                    startDecorator={<LocationOn sx={{ color: brandColor }} />}
                    value={selectedLocation}
                    onChange={(_, value) => setSelectedLocation(value)}
                    sx={{
                        minWidth: 200,
                        "& .Joy-Select-button": {
                            borderColor: brandColor,
                        },
                        "& .Joy-Option-root": {
                            "&:hover": {
                                backgroundColor: brandColor,
                            },
                        },
                    }}
                >
                    <Option value="all">All Locations</Option>
                    {Array.from(new Set(institutions.flatMap(inst => inst.locations.map(loc => loc.country)))).map((location) => (
                        <Option key={location} value={location}>
                            {location}
                        </Option>
                    ))}
                </Select>
            </Sheet>

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
                        {error[0]}
                    </Typography>
                    <Typography level="body-md" color="neutral">
                        {error[1]}
                    </Typography>
                </Box>
            )}

            {/* Institutions Grid */}
            {!loading && !error && institutions.length === 0 && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography level="h3" sx={{ mb: 1 }}>
                        No Results Found
                    </Typography>
                    <Typography level="body-md" color="neutral">
                        Try adjusting your search or filter criteria
                    </Typography>
                </Box>
            )}

            {!loading && !error && institutions.length > 0 && (
                <Grid container spacing={3}>
                    {institutions.map((institution) => (
                        <Grid key={institution._id} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "md",
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{ display: "flex", flexDirection: "column", height: "100%" }}
                                >
                                    {/* Header */}
                                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                        <Avatar
                                            src={`http://localhost:3001/uploads/${institution.profilePicture}`}
                                            sx={{ width: 56, height: 56 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography level="h4">
                                                {getValue(institution.institutionName)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Info Grid wrapped in a flex-grow box */}
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}
                                    >
                                        {/* Display Locations */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <LocationOn sx={{ fontSize: 20 }} />
                                            <Typography level="body-sm">
                                                {institution.locations.map(loc => loc.city).join(", ") || "Location not available"}
                                            </Typography>
                                        </Box>

                                        {/* Display Programs */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <School sx={{ fontSize: 20 }} />
                                            <Typography level="body-sm">
                                                Programs: {institution.programs.length}
                                            </Typography>
                                        </Box>

                                        {/* Display Intakes */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AccessTime sx={{ fontSize: 20 }} />
                                            <Typography level="body-sm">
                                                Intakes: {extractMonths(institution.programs[0]?.intakes)}
                                            </Typography>
                                        </Box>

                                        {/* Language Requirements */}
                                        <Box>
                                            <Typography level="body-md" fontWeight="bold" sx={{ mb: 1 }}>
                                                Language Requirements
                                            </Typography>
                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                <Chip color="primary" size="sm">
                                                    IELTS: {getValue(institution.entryRequirements?.undergraduate?.IELTS)}
                                                </Chip>
                                                <Chip color="primary" size="sm">
                                                    TOEFL: {getValue(institution.entryRequirements?.undergraduate?.TOEFL)}
                                                </Chip>
                                                <Chip color="primary" size="sm">
                                                    PTE: {getValue(institution.entryRequirements?.undergraduate?.PTE)}
                                                </Chip>
                                            </Box>
                                        </Box>

                                        {/* Academic Requirements */}
                                        <Box>
                                            <Typography level="body-md" fontWeight="bold" sx={{ mb: 1 }}>
                                                Academic Requirements
                                            </Typography>
                                            <Typography level="body-sm" sx={{ mb: 1 }}>
                                                Undergraduate: {getValue(institution.entryRequirements?.undergraduate?.GPA)}
                                            </Typography>
                                            <Typography level="body-sm">
                                                Postgraduate: {getValue(institution.entryRequirements?.postgraduate?.GPA)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Divider and Action Button pinned at bottom */}
                                    <Divider sx={{ mb: 2 }} />
                                    <Button
                                        fullWidth
                                        color="primary"
                                        endDecorator={<ArrowForward />}
                                        onClick={() => institutionsCheck(institution)}
                                        sx={{
                                            backgroundColor: brandColor,
                                            "&:hover": {
                                                backgroundColor: "#4338ca",
                                            },
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}