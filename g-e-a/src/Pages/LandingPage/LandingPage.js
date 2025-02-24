import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Button, styled } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './LandingPage.css';

// Update these image imports according to your project structure
import LandingImage from '../../images/LandingPageBG.png';
import FinancialImg from '../../images/Financial.png';
import Bestfit from '../../images/BestFit.png';
import CostAnalysisImg from '../../images/financial.jpg';
import ThingsToConsider from '../../images/thingsToConsider.png';

const cardsData = [
    {
        image: FinancialImg,
        title: 'Check Financial Eligibility',
        content: 'Assess your financial readiness with our comprehensive evaluation tool. Get personalized insights into funding options and budget planning.'
    },
    {
        image: Bestfit,
        title: 'Find Your Best Fit',
        content: 'Discover universities and programs that match your academic profile and career aspirations through our intelligent matching system.'
    },
    {
        image: CostAnalysisImg,
        title: 'Cost Analysis',
        content: 'Detailed breakdown of tuition fees, living expenses, and hidden costs. Interactive calculators for accurate financial planning.'
    }
];

const keyPoints = [
    'Program Selection',
    'University Accreditation',
    'Cost Breakdown',
    'Visa Process',
    'Language Requirements',
    'Cultural Preparation',
    'Health Insurance',
    'Housing Options',
    'Part-time Work',
    'Safety Measures',
    'Career Prospects',
    'Student Support'
];

const LandingPage = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className={`landing-hero ${isLandingPage ? 'active' : ''}`}>
                <div className="hero-grid">
                    <div className="hero-text">
                        <h1>Global Education Made Accessible</h1>
                        <p className="hero-subtitle">
                            Your complete partner in navigating international education. From applications to arrival,
                            we simplify every step of your journey.
                        </p>
                        <Button
                            variant="contained"
                            size="large"
                            className="cta-main"
                            sx={{
                                bgcolor: 'var(--primary)',
                                '&:hover': { bgcolor: 'var(--primary-dark)' }
                            }}
                        >
                            Start Free Assessment
                        </Button>
                    </div>
                    <div className="hero-image-container">
                        <img
                            src={LandingImage}
                            alt="Students studying abroad"
                            className="responsive-hero-image"
                        />
                        <div className="image-overlay" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="cards-container">
                    {cardsData.map((card, index) => (
                        <FeatureCard key={index}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    image={card.image}
                                    alt={card.title}
                                    sx={{
                                        height: { xs: 180, md: 220 },
                                        objectFit: 'contain',
                                        width: '100%'
                                    }}
                                />
                                <CardContent className="card-body">
                                    <Typography variant="h5" className="card-title">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" className="card-description">
                                        {card.content}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </FeatureCard>
                    ))}
                </div>
            </section>

            {/* Key Considerations Section */}
            <section className="considerations">
                <div className="considerations-grid">
                    <div className="considerations-image">
                        <img
                            src={ThingsToConsider}
                            alt="Study abroad considerations"
                            className="responsive-considerations-image"
                        />
                    </div>
                    <div className="considerations-list">
                        <h2>Key Study Abroad Factors</h2>
                        <div className="points-container">
                            {keyPoints.map((point, index) => (
                                <div key={index} className="point-item">
                                    <CheckCircleOutlineIcon className="point-icon" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows[2],
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
    '.card-body': {
        padding: '1.5rem',
        minHeight: '200px',
        [theme.breakpoints.down('md')]: {
            minHeight: 'auto',
            padding: '1rem'
        }
    },
    '.card-title': {
        fontWeight: 600,
        color: theme.palette.primary.main,
        marginBottom: '1rem'
    },
    '.card-description': {
        color: theme.palette.text.secondary,
        lineHeight: 1.6
    }
}));

export default LandingPage;