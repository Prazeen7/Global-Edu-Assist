"use client"

import { useState, useEffect } from "react"
import axios from "../../utils/axiosConfig"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import BusinessIcon from "@mui/icons-material/Business"
import PeopleIcon from "@mui/icons-material/People"
import DescriptionIcon from "@mui/icons-material/Description"
import PageHeader from "../../components/Admin/PageHeader"
import StatCard from "../../components/Admin/StatCard"
import OverviewChart from "../../components/Admin/OverviewChart"
import Typography from "@mui/material/Typography"

function Dashboard() {
    const [institutions, setInstitutions] = useState([])
    const [agents, setAgents] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Utility to handle createdAt formats
    const getDateFromCreatedAt = (createdAt) => {
        if (!createdAt) return null
        if (typeof createdAt === "string") {
            return new Date(createdAt)
        } else if (createdAt && createdAt.$date) {
            return new Date(createdAt.$date)
        }
        return null
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Updated API endpoints to match your routes
                const [institutionsResponse, agentsResponse, usersResponse] = await Promise.all([
                    axios.get("/institutions"),
                    axios.get("/getAgent"), // This matches your agent route
                    axios.get("/users"),    // This matches your user route
                ])

                // Process institutions data
                const institutionsData = Array.isArray(institutionsResponse?.data)
                    ? institutionsResponse.data
                    : (institutionsResponse?.data?.data || []);
                setInstitutions(institutionsData);

                // Process agents data - handle both data formats
                const agentsData = Array.isArray(agentsResponse?.data)
                    ? agentsResponse.data
                    : (agentsResponse?.data?.data || []);
                setAgents(agentsData);

                // Process users data - handle both data formats and filter students
                const usersData = Array.isArray(usersResponse?.data)
                    ? usersResponse.data
                    : (usersResponse?.data?.data || []);

                // Filter students by user === 'user' (not 'u' as in your original code)
                setStudents(usersData.filter((user) => user.user === "user"));

                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                setError("Failed to fetch data. Please try again later.")
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const getChangeData = (currentData) => {
        const safeData = Array.isArray(currentData) ? currentData : []
        if (safeData.length === 0) return { change: 0 }

        try {
            const now = new Date()
            now.setUTCHours(23, 59, 59, 999)
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

            const currentWeekCount = safeData.filter((item) => {
                const createdAt = getDateFromCreatedAt(item.createdAt)
                return createdAt && createdAt >= oneWeekAgo && createdAt <= now
            }).length

            const previousWeekCount = safeData.filter((item) => {
                const createdAt = getDateFromCreatedAt(item.createdAt)
                return createdAt && createdAt >= twoWeeksAgo && createdAt < oneWeekAgo
            }).length

            const change =
                previousWeekCount === 0
                    ? currentWeekCount > 0
                        ? 100
                        : 0
                    : Math.round(((currentWeekCount - previousWeekCount) / previousWeekCount) * 100)

            return { change }
        } catch (error) {
            console.error("Error calculating change data:", error)
            return { change: 0 }
        }
    }

    if (loading) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <Typography variant="h6">Loading dashboard data...</Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Dashboard"
                subtitle={`Overview as of ${new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
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
                    <OverviewChart institutions={institutions} agents={agents} students={students} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dashboard