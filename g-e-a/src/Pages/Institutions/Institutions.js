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

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const navigate = useNavigate();

  const brandColor = "#4f46e5";

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://localhost:3001/institutions")
      .then((response) => {
        setInstitutions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching institutions:", error);
        setError("Failed to fetch institutions. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Learn more navigation
  const institutionsCheck = (institution) => {
    navigate(`/institutionPage/${institution._id}`, { state: institution });
  };

  // Get unique locations for filter
  const locations = Array.from(new Set(institutions.flatMap((inst) => inst.locations || [])));

  // Filter institutions based on search and location
  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch = institution.university?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" ||
      institution.locations?.some((loc) => loc.toLowerCase().includes(selectedLocation.toLowerCase()));
    return matchesSearch && matchesLocation;
  });

  // Helper function to handle missing data
  const getValue = (value, fallback = "N/A") => {
    return value || fallback;
  };

  return (
    <Box sx={{ width: "100%", margin: "0 auto", p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography level="h1" sx={{ mb: 1, color: brandColor }}>
          Find Your Perfect Institution
        </Typography>
        <Typography level="body-lg" color="neutral">
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
          {locations.map((location) => (
            <Option key={location} value={location.toLowerCase()}>
              {location}
            </Option>
          ))}
        </Select>
        <Button
          color="#4f46e5"
          variant="outlined"
          startDecorator={<FilterList />}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Filters
        </Button>
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
            Error
          </Typography>
          <Typography level="body-md" color="neutral">
            {error}
          </Typography>
        </Box>
      )}

      {/* Institutions Grid */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredInstitutions.map((institution) => (
            <Grid key={institution._id} xs={12} sm={6} md={4} lg={3}> {/* Adjusted for 4 cards in a row */}
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
                <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Header */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Avatar src={getValue(institution.avatar, "/placeholder.svg")} sx={{ width: 56, height: 56 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography level="h4">{getValue(institution.university)}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Info Grid wrapped in a flex-grow box */}
                  <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn sx={{ fontSize: 20 }} />
                      <Typography level="body-sm">{getValue(institution.locations?.join(", "))}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <School sx={{ fontSize: 20 }} />
                      <Typography level="body-sm">
                        Tuition: {getValue(institution.average_tuition)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime sx={{ fontSize: 20 }} />
                      <Typography level="body-sm">
                        Intakes: {getValue(institution.intakes?.join(", "))}
                      </Typography>
                    </Box>

                    {/* Language Requirements */}
                    <Box>
                      <Typography level="body-md" fontWeight="bold" sx={{ mb: 1 }}>
                        Language Requirements
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip color="primary" size="sm">
                          IELTS: {getValue(institution.language_requirements?.IELTS)}
                        </Chip>
                        <Chip color="primary" size="sm">
                          TOEFL: {getValue(institution.language_requirements?.TOEFL)}
                        </Chip>
                        <Chip color="primary" size="sm">
                          PTE: {getValue(institution.language_requirements?.PTE)}
                        </Chip>
                      </Box>
                    </Box>

                    {/* Academic Requirements */}
                    <Box>
                      <Typography level="body-md" fontWeight="bold" sx={{ mb: 1 }}>
                        Academic Requirements
                      </Typography>
                      <Typography level="body-sm" sx={{ mb: 1 }}>
                        Undergraduate: {getValue(institution.academic_requirements?.undergraduate)}
                      </Typography>
                      <Typography level="body-sm" sx={{ mb: 2 }}>
                        Postgraduate: {getValue(institution.academic_requirements?.postgraduate)}
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

      {/* Empty State */}
      {!loading && !error && filteredInstitutions.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography level="h3" sx={{ mb: 1 }}>
            No Results Found
          </Typography>
          <Typography level="body-md" color="neutral">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
}