import React from 'react';
import { useState, useEffect } from "react";
import {
    Container,
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LandingImage from '../../images/LandingPageBG.png';
import FinancialImg from '../../images/Financial.png';
import Bestfit from '../../images/BestFit.png';
import CostAnalysisImg from '../../images/financial.jpg';
import ThingsToConsider from '../../images/thingsToConsider.png';
import '../Institutions/institutions.css'

const cardsData = [
    {
        image: FinancialImg,
        title: "Check Financial Eligibility",
        content:
            "Assess your financial readiness with our comprehensive evaluation tool. Get personalized insights into funding options and budget planning.",
    },
    {
        image: Bestfit,
        title: "Find Your Best Fit",
        content:
            "Discover universities and programs that match your academic profile and career aspirations through our intelligent matching system.",
    },
    {
        image: CostAnalysisImg,
        title: "Cost Analysis",
        content:
            "Detailed breakdown of tuition fees, living expenses, and hidden costs. Interactive calculators for accurate financial planning.",
    },
];

const keyPoints = [
    "Program Selection",
    "University Accreditation",
    "Cost Breakdown",
    "Visa Process",
    "Language Requirements",
    "Cultural Preparation",
    "Health Insurance",
    "Housing Options",
    "Part-time Work",
    "Safety Measures",
    "Career Prospects",
    "Student Support",
];

export default function LandingPage() {
    const theme = useTheme();
    const brandColor = "#4f46e5";
    const [currentPage, setCurrentPage] = useState(1); // Default to page 1

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    return (
        <Box component="main">
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${brandColor}10, ${theme.palette.background.default})`,
                    py: 10,
                    overflow: 'hidden',
                }}
            >
                <Container>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box textAlign={{ xs: 'center', md: 'left' }} mb={4}>
                                <Typography variant="h3" component="h1" fontWeight="bold">
                                    Global Education Made Accessible
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    mt={2}
                                    maxWidth={600}
                                    mx={{ xs: 'auto', md: 0 }}
                                >
                                    Your complete partner in navigating international education. From applications to arrival, we simplify every step of your journey.
                                </Typography>
                                <Box mt={4} display="flex" justifyContent={{ xs: 'center', md: 'flex-start' }} gap={2} flexWrap="wrap">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{ backgroundColor: brandColor, '&:hover': { backgroundColor: brandColor } }}
                                    >
                                        Start Free Assessment
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: brandColor,
                                            color: brandColor,
                                            '&:hover': { borderColor: brandColor, backgroundColor: `${brandColor}10` },
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: { xs: 300, md: 400 },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={LandingImage}
                                    alt="Students studying abroad"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `linear-gradient(45deg, ${brandColor}20, transparent)`,
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, backgroundColor: theme.palette.grey[100] }}>
                <Container>
                    <Box textAlign="center" mb={6}>
                        <Typography variant="h4" fontWeight="bold">
                            Our Features
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mt={2}>
                            Everything you need to start your education journey
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {cardsData.map((card, index) => (
                            <Grid key={index} item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: 400, // fixed overall card height
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={card.image}
                                        alt={card.title}
                                        sx={{
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.05)' },
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" mb={1}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Key Considerations Section */}
            <Box sx={{ py: 10 }}>
                <Container>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: { xs: 300, md: 400 },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={ThingsToConsider}
                                    alt="Study abroad considerations"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    Key Study Abroad Factors
                                </Typography>
                                <Grid container spacing={2} mt={2}>
                                    {keyPoints.map((point, index) => (
                                        <Grid key={index} item xs={6}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    backgroundColor: theme.palette.grey[100],
                                                    transition: 'transform 0.3s, background-color 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        backgroundColor: theme.palette.grey[200],
                                                    },
                                                }}
                                            >
                                                <CheckCircleIcon sx={{ color: brandColor, mr: 1 }} />
                                                <Typography variant="body2" fontWeight={500}>
                                                    {point}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{ py: 10, borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.grey[100] }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">
                        Ready to Start Your Journey?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={2} mx="auto" maxWidth={600}>
                        Take the first step towards your international education goals today.
                    </Typography>
                    <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ backgroundColor: brandColor, '&:hover': { backgroundColor: brandColor } }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: brandColor,
                                color: brandColor,
                                '&:hover': { borderColor: brandColor, backgroundColor: `${brandColor}10` },
                            }}
                        >
                            Contact Us
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
