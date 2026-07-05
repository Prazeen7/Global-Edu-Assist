import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
} from '@mui/material';
import { ExpandMore, Description, Info } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import '../Institutions/institutions.css'

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: '12px 0',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: '12px 0' },
}));

const StyledTableHeader = styled(TableRow)(({ theme }) => ({
  '& th': {
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderBottom: `2px solid #e2e8f0`,
  },
}));

export default function Documents() {
  const [documentCategories, setDocumentCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    axios.get('http://localhost:3001/api/documents')
      .then((response) => {
        const formattedData = response.data.map((category) => ({
          title: category.document,
          details: category.docs.map((doc, index) => ({
            name: doc,
            source: category.src[index],
            additional: category.info[index],
          })),
        }));
        setDocumentCategories(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching institutions:", error);
    });
    window.scrollTo({
        top: 0,
        behavior: "smooth", 
    });
}, [currentPage]);

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <Typography variant="h4" sx={{
          mb: 3,
          color: '#1e293b',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <Description sx={{ color: '#4f46e5', fontSize: '2rem' }} />
          Required Documents
        </Typography>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <Typography variant="body1" sx={{
            mb: 4,
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: '#64748b',
          }}>
            <Info sx={{ color: '#4f46e5' }} />
            General document requirements. Visit individual institution pages for specific details.
          </Typography>

          {documentCategories.map((category, index) => (
            <React.Fragment key={index}>
              <StyledAccordion>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: '#4f46e5' }} />}
                  sx={{
                    '&:hover': { backgroundColor: '#f8fafc' },
                    padding: '0 16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#e0e7ff',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4f46e5',
                      fontSize: '0.875rem'
                    }}>
                      {index + 1}
                    </span>
                    {category.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ padding: 0 }}>
                  <TableContainer sx={{
                    borderTop: '1px solid #e2e8f0',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                  }}>
                    <Table>
                      <TableHead>
                        <StyledTableHeader>
                          <TableCell align="center" sx={{ width: '10%' }}>S.N.</TableCell>
                          <TableCell align="left" sx={{ width: '40%' }}>Document</TableCell>
                          <TableCell align="left" sx={{ width: '25%' }}>Source</TableCell>
                          <TableCell align="left" sx={{ width: '25%' }}>Details</TableCell>
                        </StyledTableHeader>
                      </TableHead>
                      <TableBody>
                        {category.details.map((doc, idx) => (
                          <TableRow
                            key={idx}
                            sx={{
                              '&:last-child td': { borderBottom: 0 },
                              '&:hover': { backgroundColor: '#f8fafc' }
                            }}
                          >
                            <TableCell align="center" sx={{ color: '#64748b' }}>
                              {idx + 1}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                            <TableCell sx={{ color: '#4f46e5' }}>{doc.source}</TableCell>
                            <TableCell sx={{ color: '#64748b' }}>{doc.additional}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </StyledAccordion>

              {index < documentCategories.length - 1 && (
                <Divider sx={{ my: 1, borderColor: '#e2e8f0' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}