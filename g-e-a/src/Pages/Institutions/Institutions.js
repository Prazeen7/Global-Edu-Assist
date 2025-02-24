import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import "./institutions.css";
import axios from 'axios';
import Grid from '@mui/joy/Grid';

export default function Institution() {
  const [institutions, setInstitutions] = useState([]);
  const navigate = useNavigate();

  //fetching institution data 
  useEffect(() => {
    axios.get('http://localhost:3001/institutions')
      .then((response) => {
        setInstitutions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching institutions:", error);
      });
  }, []);

  //Lear more navigation
  const institutionsCheck = (institution) => {
    navigate(`/institutionPage/${institution.id}`, { state: institution });
  };

  return (
    <Box sx={{ flexGrow: 2, p: 3, ml: 10 }}>
      <Grid
        container
        gap={5}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        {institutions.map((institution) => (
          <Grid
            key={institution._id}
            xs={12} // Full width on extra small screens
            sm={6} // 2 cards per row on small screens
            md={4} // 3 cards per row on medium screens
            lg={3.5} // 3 cards per row on large screens
          >
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'md',
                p: 2.5,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 'lg',
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Avatar
                  src={institution.avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 'md',
                    backgroundColor: 'background.level1',
                    '& img': {
                      objectFit: 'contain'
                    }
                  }}
                />
                <Typography level="h4" component="h2" sx={{
                  fontSize: '1.2rem',
                  fontFamily: "Parkinsans",
                  fontWeight: 'bold',
                  flexGrow: 1,
                  textAlign: 'left',
                  alignSelf: 'center'
                }}>
                  {institution.university}
                </Typography>
              </Box>

              <Divider inset="none" sx={{ mb: 1 }} />

              <CardContent sx={{ p: 1, flexGrow: 1 }}>
                <List sx={{ '--ListItem-paddingY': '0.5rem' }} >
                  {[
                    { label: 'Location:', value: institution.locations.join(', ') },
                    { label: 'Avg. Tuition:', value: institution.average_tuition, color: 'primary' },
                    { label: 'Intakes:', value: institution.intakes.join(', ') },
                    { label: 'Language Req:', value: `IELTS ${institution.language_requirements.IELTS} / TOEFL ${institution.language_requirements.TOEFL} / PTE ${institution.language_requirements.PTE}` },
                  ].map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 3
                      }}>
                        <Typography level="body2" sx={{ textAlign: 'left' }}>
                          {item.label}
                        </Typography>
                        <Typography
                          level="body2"
                          sx={{
                            textAlign: 'right',
                            flex: 1
                          }}
                          color={item.color || 'neutral'}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography level="body2" fontWeight="lg" mb={1.5}>
                    Academic Requirements:
                  </Typography>
                  <List sx={{ '--ListItem-paddingY': '0.375rem' }}>
                    {[
                      { level: 'Undergraduate:', requirement: institution.academic_requirements.undergraduate },
                      { level: 'Postgraduate:', requirement: institution.academic_requirements.postgraduate },
                    ].map((item, academicIndex) => (
                      <ListItem key={academicIndex}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          gap: 2
                        }}>
                          <Typography level="body3" sx={{ textAlign: 'left' }}>
                            {item.level}
                          </Typography>
                          <Typography
                            level="body3"
                            sx={{
                              textAlign: 'right',
                              flex: 1
                            }}
                          >
                            {item.requirement}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
              <Button
                onClick={() => institutionsCheck(institution)} 
                variant="solid"
                size="sm"
                fullWidth
                endDecorator={<KeyboardArrowRight />}
                sx={{
                  backgroundColor: '#4f46e5',
                  '&:hover': { backgroundColor: '#4338ca' },
                  mt: 1
                }}
              >
                Learn More
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}