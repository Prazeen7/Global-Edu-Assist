import React from 'react';
import { useLocation } from 'react-router-dom';
import './LandingPage.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Cost from '../images/financial.jpg';
import financial from '../images/Financial.png';
import Bestfit from '../images/BestFit.png';

function LandingPage() {
    const location = useLocation();

    // Check if the current path is the landing page
    const isLandingPage = location.pathname === '/';

    return (
        <>
            <div className={`landing-page ${isLandingPage ? 'gradient-background' : ''}`}>
                {/* Left Section */}
                <div className="text-section">
                    <h1>From Documents to Dreams: We’ve Got You Covered</h1>
                    <p>At Global EDU Assist, we simplify your study abroad journey. From document preparation to application support, we turn aspirations into achievements. Your global success starts here.</p>
                </div>

                {/* Right Section (Image) */}
                <div className="image-section"></div>
            </div>

            <div className='card-container'>
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            width="100%"
                            image={financial}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Check Your Financial Eligibility
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Checking your financial eligibility is an essential step in your journey to study abroad. By assessing your financial situation, you can determine if you meet the necessary requirements for tuition fees, living expenses, and other related costs.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            width="100%"
                            image={Bestfit}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Find The Best Fit for You
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Finding the best fit for your academic and career goals is key to unlocking your potential. Whether you’re looking for universities that align with your interests, programs that match your skills, or a destination that feels like home, we’re here to guide you every step of the way.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            width="100%"
                            image={Cost}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Evaluate Your Cost
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Understanding the cost of your education is crucial for planning your journey abroad. We help you evaluate tuition fees, living expenses, and other financial factors to give you a clear picture of what to expect. With our guidance, you can make informed decisions and explore options that fit your budget, ensuring a stress-free and well-prepared study experience.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        </>
    );
}

export default LandingPage;
