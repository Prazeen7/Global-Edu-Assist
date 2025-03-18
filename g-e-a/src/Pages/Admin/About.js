import { useState } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import SaveIcon from "@mui/icons-material/Save"
import UploadIcon from "@mui/icons-material/Upload"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import Avatar from "@mui/material/Avatar"
import PageHeader from "../../components/Admin/PageHeader"

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`about-tabpanel-${index}`}
            aria-labelledby={`about-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

function AboutPageContent() {
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="About Page Content"
                subtitle="Edit the content of your about page"
                action={true}
                actionIcon={<SaveIcon />}
                actionText="Save Changes"
            />

            <Paper sx={{ width: "100%", mt: 3 }}>
                <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                    <Tab label="Overview" />
                    <Tab label="Mission & Vision" />
                    <Tab label="Our Team" />
                    <Tab label="Our History" />
                </Tabs>

                {/* Overview Section */}
                <TabPanel value={value} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Page Title" defaultValue="About Global Edu Assist" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Page Subtitle"
                                defaultValue="Your Trusted Partner in International Education"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Overview"
                                defaultValue="Global Edu Assist was founded with a mission to help students navigate the complex world of international education. With years of experience and a dedicated team of education experts, we provide comprehensive support for students seeking to study abroad."
                                variant="outlined"
                                multiline
                                rows={6}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Featured Image
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                <Card sx={{ width: 320, height: 180 }}>
                                    <CardMedia component="img" height="180" image="/placeholder.svg?height=180&width=320" alt="About" />
                                </Card>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                    <Button variant="outlined" startIcon={<UploadIcon />}>
                                        Upload New Image
                                    </Button>
                                    <Button variant="outlined" startIcon={<VisibilityIcon />}>
                                        Preview
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Mission & Vision Section */}
                <TabPanel value={value} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Section Title" defaultValue="Our Mission & Vision" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mission Statement"
                                defaultValue="Our mission is to empower students worldwide by providing access to quality international education opportunities, personalized guidance, and comprehensive support throughout their educational journey."
                                variant="outlined"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Vision Statement"
                                defaultValue="We envision a world where geographical, financial, and informational barriers to quality education are eliminated, enabling students from all backgrounds to pursue their educational dreams globally."
                                variant="outlined"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Values Title" defaultValue="Our Core Values" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Values</Typography>
                                <Button variant="outlined" startIcon={<AddIcon />} size="small">
                                    Add Value
                                </Button>
                            </Box>

                            {[1, 2, 3, 4].map((index) => (
                                <Card key={index} sx={{ mb: 3, p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Value {index}</Typography>
                                        <Box>
                                            <IconButton size="small">
                                                <ArrowUpwardIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <ArrowDownwardIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Title"
                                                defaultValue={
                                                    index === 1
                                                        ? "Integrity"
                                                        : index === 2
                                                            ? "Excellence"
                                                            : index === 3
                                                                ? "Student-Centered"
                                                                : "Innovation"
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Description"
                                                defaultValue={
                                                    index === 1
                                                        ? "We operate with honesty, transparency, and ethical standards in all our interactions."
                                                        : index === 2
                                                            ? "We strive for excellence in our services and continuously improve our processes."
                                                            : index === 3
                                                                ? "We put students' needs and goals at the center of everything we do."
                                                                : "We embrace innovative approaches to solve complex educational challenges."
                                                }
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Our Team Section */}
                <TabPanel value={value} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Section Title" defaultValue="Meet Our Team" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Section Description"
                                defaultValue="Our team of education experts is dedicated to helping students achieve their academic goals internationally."
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Team Members</Typography>
                                <Button variant="outlined" startIcon={<AddIcon />} size="small">
                                    Add Team Member
                                </Button>
                            </Box>

                            {[1, 2, 3].map((index) => (
                                <Card key={index} sx={{ mb: 3, p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Team Member {index}</Typography>
                                        <Box>
                                            <IconButton size="small">
                                                <ArrowUpwardIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <ArrowDownwardIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                defaultValue={
                                                    index === 1
                                                        ? "Dr. Sarah Johnson"
                                                        : index === 2
                                                            ? "Michael Chen, MBA"
                                                            : "Emily Rodriguez, M.Ed."
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Position"
                                                defaultValue={
                                                    index === 1
                                                        ? "Founder & CEO"
                                                        : index === 2
                                                            ? "Director of Institutional Relations"
                                                            : "Head of Student Services"
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Bio"
                                                defaultValue={
                                                    index === 1
                                                        ? "Dr. Johnson has over 15 years of experience in international education and founded Global Edu Assist to help students worldwide access quality education."
                                                        : index === 2
                                                            ? "Michael manages relationships with our partner institutions worldwide, ensuring students have access to the best educational opportunities."
                                                            : "Emily leads our student services team, providing personalized guidance and support throughout the application process."
                                                }
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Photo
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar
                                                    src="/placeholder.svg?height=96&width=96"
                                                    alt={`Team Member ${index}`}
                                                    sx={{ width: 96, height: 96 }}
                                                />
                                                <Button variant="outlined" size="small" startIcon={<UploadIcon />}>
                                                    Upload Photo
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Our History Section */}
                <TabPanel value={value} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Section Title" defaultValue="Our Journey" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Section Description"
                                defaultValue="From our humble beginnings to becoming a leading education assistance provider, our journey has been driven by a passion for helping students achieve their dreams."
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Timeline Events</Typography>
                                <Button variant="outlined" startIcon={<AddIcon />} size="small">
                                    Add Event
                                </Button>
                            </Box>

                            {[1, 2, 3, 4].map((index) => (
                                <Card key={index} sx={{ mb: 3, p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Event {index}</Typography>
                                        <Box>
                                            <IconButton size="small">
                                                <ArrowUpwardIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <ArrowDownwardIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Year"
                                                defaultValue={index === 1 ? "2010" : index === 2 ? "2015" : index === 3 ? "2018" : "2022"}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Title"
                                                defaultValue={
                                                    index === 1
                                                        ? "Foundation"
                                                        : index === 2
                                                            ? "International Expansion"
                                                            : index === 3
                                                                ? "Digital Transformation"
                                                                : "Global Recognition"
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Description"
                                                defaultValue={
                                                    index === 1
                                                        ? "Global Edu Assist was founded with a mission to help students navigate international education opportunities."
                                                        : index === 2
                                                            ? "We expanded our services to cover educational institutions in over 20 countries."
                                                            : index === 3
                                                                ? "Launched our digital platform to provide seamless support to students worldwide."
                                                                : "Recognized as a leading education assistance provider with over 10,000 successful placements."
                                                }
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Image
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Card sx={{ width: 160, height: 96 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="96"
                                                        image="/placeholder.svg?height=96&width=160"
                                                        alt={`Event ${index}`}
                                                    />
                                                </Card>
                                                <Button variant="outlined" size="small" startIcon={<UploadIcon />}>
                                                    Upload Image
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </Box>
    )
}

export default AboutPageContent

