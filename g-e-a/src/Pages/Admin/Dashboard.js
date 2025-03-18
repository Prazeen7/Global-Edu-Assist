import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import BusinessIcon from "@mui/icons-material/Business"
import PeopleIcon from "@mui/icons-material/People"
import DescriptionIcon from "@mui/icons-material/Description"
import EditIcon from "@mui/icons-material/Edit"
import PageHeader from "../../components/Admin/PageHeader"
import StatCard from "../../components/Admin/StatCard"
import OverviewChart from "../../components/Admin/OverviewChart"
import RecentActivity from "../../components/Admin/RecentActivity"

function Dashboard() {
    return (
        <Box sx={{ p: 3 }}>
            <PageHeader title="Dashboard" subtitle="Overview of your educational assistance platform" />

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Institutions" value="142" change={12} icon={<BusinessIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Agents" value="48" change={4} icon={<PeopleIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending Documents" value="27" change={-2} icon={<DescriptionIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Content Updates" value="12" change={3} icon={<EditIcon />} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <OverviewChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <RecentActivity />
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dashboard

