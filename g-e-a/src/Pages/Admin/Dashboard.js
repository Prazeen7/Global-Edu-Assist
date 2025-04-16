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
import Typography from "@mui/material/Typography";

function Dashboard() {
    const [institutions, setInstitutions] = useState([]);
    const [agents, setAgents] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Utility to handle createdAt formats
    const getDateFromCreatedAt = (createdAt) => {
        if (!createdAt) return null;
        if (typeof createdAt === 'string') {
            return new Date(createdAt);
        } else if (createdAt && createdAt.$date) {
            return new Date(createdAt.$date);
        }
        return null;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [institutionsResponse, agentsResponse, usersResponse] = await Promise.all([
                    axios.get("http://localhost:3001/api/institutions"),
                    axios.get("http://localhost:3001/api/agents"),
                    axios.get("http://localhost:3001/api/users"),
                ]);

                setInstitutions(Array.isArray(institutionsResponse?.data) ? institutionsResponse.data : []);
                setAgents(Array.isArray(agentsResponse?.data) ? agentsResponse.data : []);
                // Filter students by user === 'u'
                setStudents(Array.isArray(usersResponse?.data) ? usersResponse.data.filter(user => user.user === 'u') : []);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getChangeData = (currentData) => {
        const safeData = Array.isArray(currentData) ? currentData : [];
        if (safeData.length === 0) return { change: 0 };

        try {
            const now = new Date();
            now.setUTCHours(23, 59, 59, 999);
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

            const currentWeekCount = safeData.filter(item => {
                const createdAt = getDateFromCreatedAt(item.createdAt);
                return createdAt && createdAt >= oneWeekAgo && createdAt <= now;
            }).length;

            const previousWeekCount = safeData.filter(item => {
                const createdAt = getDateFromCreatedAt(item.createdAt);
                return createdAt && createdAt >= twoWeeksAgo && createdAt < oneWeekAgo;
            }).length;

            const change = previousWeekCount === 0
                ? currentWeekCount > 0 ? 100 : 0
                : Math.round(((currentWeekCount - previousWeekCount) / previousWeekCount) * 100);

            return { change };
        } catch (error) {
            console.error("Error calculating change data:", error);
            return { change: 0 };
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Typography variant="h6">Loading dashboard data...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Dashboard"
                subtitle={`Overview as of ${new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`}
            />

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Institutions"
                        value={institutions.length}
                        changeData={getChangeData(institutions)}
                        icon={<BusinessIcon fontSize="small" />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Agents"
                        value={agents.length}
                        changeData={getChangeData(agents)}
                        icon={<PeopleIcon fontSize="small" />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Students"
                        value={students.length}
                        changeData={getChangeData(students)}
                        icon={<DescriptionIcon fontSize="small" />}
                    />
                </Grid>

                <Grid item xs={12}>
                    <OverviewChart
                        institutions={institutions}
                        agents={agents}
                        students={students}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;