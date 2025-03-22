import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import OverviewChart from "../../components/Admin/OverviewChart";
import RecentActivity from "../../components/Admin/RecentActivity";
import Typography from "@mui/material/Typography";

function Dashboard() {
    // State variables for current data
    const [totalInstitutions, setTotalInstitutions] = useState(0);
    const [totalAgents, setTotalAgents] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulated previous month's data
    const prevMonthInstitutions = 120; 
    const prevMonthAgents = 40; 
    const prevMonthStudents = 500; 

    // Fetch current data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current data
                const institutionsResponse = await axios.get("http://localhost:3001/api/institutions");
                const agentsResponse = await axios.get("http://localhost:3001/api/agents");
                const studentsResponse = await axios.get("http://localhost:3001/api/users");

                // Set current data
                setTotalInstitutions(institutionsResponse.data.length);
                setTotalAgents(Object.keys(agentsResponse.data).length);
                setTotalStudents(studentsResponse.data.length);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate the change from last month
    const calculateChange = (current, previous) => {
        if (previous === 0) return 0; // Avoid division by zero
        return Math.round(((current - previous) / previous) * 100);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader title="Dashboard" subtitle="Overview of your educational assistance platform" />

            <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Total Institutions */}
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Institutions"
                        value={totalInstitutions}
                        change={calculateChange(totalInstitutions, prevMonthInstitutions)}
                        icon={<BusinessIcon />}
                    />
                </Grid>

                {/* Total Agents */}
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Agents"
                        value={totalAgents}
                        change={calculateChange(totalAgents, prevMonthAgents)}
                        icon={<PeopleIcon />}
                    />
                </Grid>

                {/* Total Students */}
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Students"
                        value={totalStudents}
                        change={calculateChange(totalStudents, prevMonthStudents)}
                        icon={<DescriptionIcon />}
                    />
                </Grid>

                {/* Overview Chart */}
                <Grid item xs={12} md={8}>
                    <OverviewChart />
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={4}>
                    <RecentActivity />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;