import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import './Documents.css';
import bg from '../../images/documentBG.jpg';

export default function Documents() {
  const [documentCategories, setDocumentCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3001/documents')
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
        console.error('Error fetching documents:', error);
      });
  }, []);

  return (
    <div
      className="documents-container"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="documents-card">
        <h2 className="documents-header">
          The information on this page is general. For institution-specific
          details, please visit the respective institution's page.
        </h2>
        {documentCategories.map((category, index) => (
          <React.Fragment key={index}>
            <Accordion
              className="accordion"
              onChange={() =>
                setSelectedCategoryIndex(
                  selectedCategoryIndex === index ? null : index
                )
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                className="accordion-summary"
              >
                <Typography className="accordion-title">
                  {category.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} className="table-container">
                  <Table aria-label="document details">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">S.No.</TableCell>
                        <TableCell align="left">Document Name</TableCell>
                        <TableCell align="center">Source</TableCell>
                        <TableCell align="left">Additional Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {category.details.map((doc, idx) => (
                        <TableRow key={idx}>
                          <TableCell align="center">{idx + 1}</TableCell>
                          <TableCell align="left">{doc.name}</TableCell>
                          <TableCell align="center">{doc.source}</TableCell>
                          <TableCell align="left">{doc.additional}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
