import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Switch from "@mui/material/Switch"
import FormControlLabel from "@mui/material/FormControlLabel"
import Divider from "@mui/material/Divider"
import SaveIcon from "@mui/icons-material/Save"
import PageHeader from "../../components/Admin/PageHeader"

function Settings() {
    return (
        <Box sx={{ p: 3 }}>
            <PageHeader title="Settings" subtitle="Manage your application settings" />

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    General Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Application Name" defaultValue="Global Edu Assist" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Support Email" defaultValue="support@globaleduassist.com" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Contact Phone" defaultValue="+1 (555) 123-4567" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Website URL"
                            defaultValue="https://www.globaleduassist.com"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Office Address"
                            defaultValue="123 Education Street, Suite 456, New York, NY 10001"
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Enable Maintenance Mode" />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
                        Save Changes
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Email Notifications
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="New Institution Registration Notifications" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="New Agent Registration Notifications" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Document Submission Notifications" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Send Weekly Summary Reports" />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
                        Save Notification Settings
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    API Integration
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="API Key"
                            defaultValue="sk_test_51HZ8Kj2eZvKYlo2CDYcY5xYD8nYXK1xmZg"
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Enable API Access" />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                        Regenerate API Key
                    </Button>
                    <Button variant="outlined">View API Documentation</Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Security Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Enable Two-Factor Authentication" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Require Strong Passwords" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Session Timeout (minutes)" defaultValue="30" variant="outlined" type="number" />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
                        Save Security Settings
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default Settings

