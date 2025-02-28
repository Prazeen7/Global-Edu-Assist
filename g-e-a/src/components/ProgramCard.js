import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { BookmarkBorder as BookmarkIcon, School as SchoolIcon } from "@mui/icons-material";

function ProgramCard({ program }) {
    return (
        <Card sx={{ height: "100%", maxWidth: 450 }}>
            <CardContent>
                <Stack spacing={3}>
                    <Stack direction="row" spacing={2}>
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: "primary.main",
                                background: (theme) =>
                                    `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}20)`,
                                border: (theme) => `2px solid ${theme.palette.primary.main}20`,
                            }}
                        >
                            <SchoolIcon sx={{ color: "primary.main" }} />
                        </Avatar>
                        <Stack spacing={0.5} flex={1}>
                            <Typography variant="h6" component="h2">
                                {program.program}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {program.institution}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Level: <Typography component="span">{program.level}</Typography>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Discipline: <Typography component="span">{program.discipline}</Typography>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Duration: <Typography component="span">{program.duration}</Typography>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Campus: <Typography component="span">{program.campus}</Typography>
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <Typography variant="h6" component="div">
                                    ${program.fees.toLocaleString()}
                                    <Typography variant="caption" color="text.secondary">
                                        /year
                                    </Typography>
                                </Typography>
                                <Typography variant="body2">
                                    Min. GPA:{" "}
                                    <Typography component="span" fontWeight="medium">
                                        {program.gpa}
                                    </Typography>
                                </Typography>
                                <Typography variant="body2">
                                    IELTS:{" "}
                                    <Typography component="span" fontWeight="medium">
                                        {program.ielts}
                                    </Typography>
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1}>
                        {program.intakes.map((intake) => (
                            <Chip key={intake} label={`${intake} Intake`} size="small" variant="outlined" />
                        ))}
                    </Stack>

                    <Button variant="outlined" startIcon={<BookmarkIcon />} fullWidth>
                        Save Program
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default ProgramCard;