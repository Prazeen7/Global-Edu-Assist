import { Avatar } from "@mui/material"
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
import PageHeader from "../../components/Admin/PageHeader"

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`landing-tabpanel-${index}`}
            aria-labelledby={`landing-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

function LandingPageContent() {
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Landing Page Content"
                subtitle="Edit the content of your landing page"
                action={true}
                actionIcon={<SaveIcon />}
                actionText="Save Changes"
            />

            <Paper sx={{ width: "100%", mt: 3 }}>
                <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                    <Tab label="Hero Section" />
                    <Tab label="Features" />
                    <Tab label="Testimonials" />
                    <Tab label="Call to Action" />
                </Tabs>

                {/* Hero Section */}
                <TabPanel value={value} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Hero Title"
                                defaultValue="Global Education Assistance for Your Future"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Hero Subtitle"
                                defaultValue="Connecting students with educational opportunities worldwide"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Hero Description"
                                defaultValue="Global Edu Assist helps students find the perfect educational institution abroad, guiding them through applications, visas, and more."
                                variant="outlined"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Hero Image
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                <Card sx={{ width: 320, height: 180 }}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="/placeholder.svg?height=180&width=320"
                                        alt="Hero image"
                                    />
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
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Primary Button Text" defaultValue="Get Started" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Primary Button URL" defaultValue="/register" variant="outlined" />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Features Section */}
                <TabPanel value={value} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Section Title" defaultValue="Our Services" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Section Description"
                                defaultValue="We provide comprehensive support for students seeking international education opportunities."
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Features</Typography>
                                <Button variant="outlined" startIcon={<AddIcon />} size="small">
                                    Add Feature
                                </Button>
                            </Box>

                            {[1, 2, 3].map((index) => (
                                <Card key={index} sx={{ mb: 3, p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Feature {index}</Typography>
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
                                                        ? "Institution Selection"
                                                        : index === 2
                                                            ? "Visa Assistance"
                                                            : "Application Support"
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
                                                        ? "We help you find the perfect educational institution based on your preferences and goals."
                                                        : index === 2
                                                            ? "Our experts guide you through the visa application process for your destination country."
                                                            : "We provide comprehensive support for your application to ensure the best chance of success."
                                                }
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Icon
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <img src="/placeholder.svg?height=24&width=24" alt="Feature icon" width={24} height={24} />
                                                </Box>
                                                <Button variant="outlined" size="small" startIcon={<UploadIcon />}>
                                                    Upload Icon
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Testimonials Section */}
                <TabPanel value={value} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Section Title" defaultValue="Student Success Stories" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Section Description"
                                defaultValue="Hear from students who have successfully achieved their educational goals with our assistance."
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1">Testimonials</Typography>
                                <Button variant="outlined" startIcon={<AddIcon />} size="small">
                                    Add Testimonial
                                </Button>
                            </Box>

                            {[1, 2].map((index) => (
                                <Card key={index} sx={{ mb: 3, p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Testimonial {index}</Typography>
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
                                                label="Quote"
                                                defaultValue={
                                                    index === 1
                                                        ? "Global Edu Assist made my dream of studying abroad a reality. Their guidance throughout the process was invaluable."
                                                        : "I couldn't have navigated the complex application and visa process without the expert help from Global Edu Assist."
                                                }
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                defaultValue={index === 1 ? "Sarah Johnson" : "Michael Chen"}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Institution"
                                                defaultValue={index === 1 ? "University of London" : "Stanford University"}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Photo
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar
                                                    src="/placeholder.svg?height=64&width=64"
                                                    alt={`Testimonial ${index}`}
                                                    sx={{ width: 64, height: 64 }}
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

                {/* Call to Action Section */}
                <TabPanel value={value} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="CTA Title"
                                defaultValue="Ready to Start Your Educational Journey?"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="CTA Description"
                                defaultValue="Contact us today to discuss your educational goals and how we can help you achieve them."
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="CTA Button Text" defaultValue="Contact Us Now" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="CTA Button URL" defaultValue="/contact" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Background Image
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                <Card sx={{ width: 320, height: 180 }}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="/placeholder.svg?height=180&width=320"
                                        alt="CTA Background"
                                    />
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
            </Paper>
        </Box>
    )
}

export default LandingPageContent

