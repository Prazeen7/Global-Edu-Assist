import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Checkbox,
    FormControlLabel,
    Button,
    Paper,
    FormGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const initialChecklist = [
    {
        id: "relationship-verification",
        label: "Relationship verification Documents",
        checked: false,
    },
    {
        id: "ward-tax-clearance",
        label: "Ward Tax Clearance Documents",
        checked: false,
    },
    {
        id: "income",
        label: "Income",
        checked: false,
        children: [
            {
                id: "ward-income-verification",
                label: "Ward Income Verification Certificates",
                checked: false,
            },
            {
                id: "salary",
                label: "Salary (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "salary-certificate",
                        label: "Salary Certificate",
                        checked: false,
                    },
                    {
                        id: "tax-clearance-3-years",
                        label: "Tax Clearance Certificate of past 3 years",
                        checked: false,
                    },
                    {
                        id: "salary-statement",
                        label: "1 year salary statement",
                        checked: false,
                    },
                    {
                        id: "pan-card",
                        label: "Pan Card",
                        checked: false,
                    },
                ],
            },
            {
                id: "rent-lease",
                label: "Rent/Lease (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "agreement-paper",
                        label: "Agreement Paper",
                        checked: false,
                    },
                    {
                        id: "rent-tax-receipt",
                        label: "Rent/Lease Tax Receipt",
                        checked: false,
                    },
                    {
                        id: "rent-statement",
                        label: "Rent/Lease statement",
                        checked: false,
                    },
                    {
                        id: "tenant-citizenship",
                        label: "Tenant Citizenship",
                        checked: false,
                    },
                    {
                        id: "land-ownership",
                        label: "Land Ownership Certificate",
                        checked: false,
                    },
                    {
                        id: "land-tax-receipt",
                        label: "Land Tax Receipt",
                        checked: false,
                    },
                ],
            },
            {
                id: "business",
                label: "Business (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "business-registration",
                        label: "Business Registration Certificate",
                        checked: false,
                    },
                    {
                        id: "pan-vat-registration",
                        label: "PAN/VAT registration",
                        checked: false,
                    },
                    {
                        id: "business-tax-clearance",
                        label: "Tax Clearance Certificate of past 3 years",
                        checked: false,
                    },
                    {
                        id: "business-salary-statement",
                        label: "1 year salary statement",
                        checked: false,
                    },
                ],
            },
            {
                id: "vehicle",
                label: "Vehicle (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "vehicle-registration",
                        label: "Vehicle registration documents",
                        checked: false,
                    },
                    {
                        id: "vehicle-road-tax",
                        label: "Vehicle road tax documents",
                        checked: false,
                    },
                    {
                        id: "agreement-letter",
                        label: "Agreement letter if private",
                        checked: false,
                    },
                    {
                        id: "transport-association",
                        label: "Letter from Transport association if public vehicle",
                        checked: false,
                    },
                    {
                        id: "vehicle-insurance",
                        label: "Vehicle insurance documents",
                        checked: false,
                    },
                ],
            },
            {
                id: "pension",
                label: "Pension (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "pension-book",
                        label: "Pension Book",
                        checked: false,
                    },
                    {
                        id: "pension-bank-statement",
                        label: "Bank statement of 1 year",
                        checked: false,
                    },
                ],
            },
            {
                id: "agriculture",
                label: "Agriculture (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "ward-letter",
                        label: "Letter from ward declaring it as source of income and tax this source is tax free",
                        checked: false,
                    },
                    {
                        id: "sales-receipts",
                        label: "Sales receipts",
                        checked: false,
                    },
                ],
            },
            {
                id: "foreign-employment",
                label: "Foreign Employment (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "salary-letter",
                        label: "Salary letter",
                        checked: false,
                    },
                    {
                        id: "passport",
                        label: "Passport",
                        checked: false,
                    },
                    {
                        id: "visa",
                        label: "Visa",
                        checked: false,
                    },
                    {
                        id: "statement-1-year",
                        label: "1 year statement",
                        checked: false,
                    },
                    {
                        id: "tax-documents",
                        label: "Tax documents",
                        checked: false,
                    },
                ],
            },
        ],
    },
    {
        id: "birth-certificates",
        label: "Birth Certificates",
        checked: false,
    },
    {
        id: "citizenships",
        label: "Applicant's and Sponsor's Citizenships",
        checked: false,
    },
    {
        id: "bank-documents",
        label: "Bank loan / Bank Balance related documents",
        checked: false,
        children: [
            {
                id: "bank-loan",
                label: "Bank Loan (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "mortgage-deed",
                        label: "Mortgage Deed",
                        checked: false,
                    },
                    {
                        id: "loan-sanction-letter",
                        label: "Loan Sanction Letter",
                        checked: false,
                    },
                    {
                        id: "land-ownership-certificates",
                        label: "Land Ownership Certificates",
                        checked: false,
                    },
                    {
                        id: "land-tax-receipt",
                        label: "Land Tax Receipt",
                        checked: false,
                    },
                    {
                        id: "bank-valuation-letter",
                        label: "Bank Valauation Letter",
                        checked: false,
                    },
                ],
            },
            {
                id: "bank-balance",
                label: "Bank balance (if any)",
                checked: false,
                conditional: true,
                applicable: false,
                children: [
                    {
                        id: "bank-balance-certificate",
                        label: "Bank Balance Certificate",
                        checked: false,
                    },
                    {
                        id: "source-of-balance",
                        label: "Source of balance",
                        checked: false,
                    },
                ],
            },
        ],
    },
    {
        id: "land-ownership-certificates",
        label: "Land Ownership Certificates",
        checked: false,
    },
    {
        id: "land-tax-receipt-3-years",
        label: "Land Tax Receipt past 3 years",
        checked: false,
    },
    {
        id: "property-valuation",
        label: "Property Valuation Letter",
        checked: false,
    },
    {
        id: "ca-report",
        label: "CA Report",
        checked: false,
    },
    {
        id: "gs-statements",
        label: "GS Statements",
        checked: false,
    },
    {
        id: "gs-forms",
        label: "GS Forms",
        checked: false,
    },
    {
        id: "offer-acceptance",
        label: "Offer acceptance",
        checked: false,
    },
    {
        id: "under-18-documents",
        label: "Under 18 documents (if any)",
        checked: false,
        conditional: true,
        applicable: false,
        children: [
            {
                id: "guardianship-proof",
                label: "Guardianship proof",
                checked: false,
            },
            {
                id: "police-report",
                label: "Police report",
                checked: false,
            },
            {
                id: "applicant-id",
                label: "Applicant's ID",
                checked: false,
            },
        ],
    },
];

export default function GSStage({ updateProgress }) {
    const [checklist, setChecklist] = useState(initialChecklist);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        calculateProgress();
    }, [checklist]);

    const calculateProgress = () => {
        let completed = 0;
        let total = 0;

        const countItems = (items) => {
            for (const item of items) {
                // Only count items that are not conditional or are applicable
                if (!item.conditional || item.applicable) {
                    total++;
                    if (item.checked) completed++;
                }

                if (item.children) {
                    countItems(item.children);
                }
            }
        };

        countItems(checklist);

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        updateProgress({ completed, total, percentage });
    };

    const handleCheckboxChange = (id, checked, parentId) => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    // If this is the item we're looking for
                    if (item.id === id) {
                        // Update children if parent is unchecked
                        let updatedChildren = item.children;
                        if (!checked && updatedChildren) {
                            updatedChildren = updatedChildren.map((child) => ({
                                ...child,
                                checked: false,
                            }));
                        }

                        return {
                            ...item,
                            checked,
                            children: updatedChildren,
                        };
                    }

                    // If this item has children, check them too
                    if (item.children) {
                        // If this is the parent of the item we're looking for
                        if (item.id === parentId) {
                            // Check if all children are checked
                            const updatedChildren = updateItems(item.children);
                            const allChildrenChecked = updatedChildren.every((child) =>
                                child.conditional && !child.applicable ? true : child.checked
                            );

                            return {
                                ...item,
                                children: updatedChildren,
                                checked: allChildrenChecked,
                            };
                        }

                        return {
                            ...item,
                            children: updateItems(item.children),
                        };
                    }

                    return item;
                });
            };

            return updateItems(prevChecklist);
        });
    };

    const handleApplicableChange = (id, applicable) => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    if (item.id === id) {
                        // Update the item and its children
                        const updatedItem = {
                            ...item,
                            applicable,
                            checked: applicable ? item.checked : false,
                        };

                        if (item.children) {
                            updatedItem.children = item.children.map((child) => ({
                                ...child,
                                checked: applicable ? child.checked : false,
                            }));
                        }

                        return updatedItem;
                    }

                    if (item.children) {
                        return {
                            ...item,
                            children: updateItems(item.children),
                        };
                    }

                    return item;
                });
            };

            return updateItems(prevChecklist);
        });
    };

    const selectAll = () => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    // Only check items that are not conditional or are applicable
                    const shouldCheck = !item.conditional || item.applicable;

                    return {
                        ...item,
                        checked: shouldCheck ? true : item.checked,
                        children: item.children ? updateItems(item.children) : undefined,
                    };
                });
            };

            return updateItems(prevChecklist);
        });
    };

    const handleAccordionChange = (id) => (event, isExpanded) => {
        setExpanded({ ...expanded, [id]: isExpanded });
    };

    const renderChecklistItem = (item, parentId, level = 0) => {
        return (
            <Box key={item.id} sx={{ ml: level > 0 ? 4 : 0, mt: 1 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={item.checked}
                            disabled={item.conditional && !item.applicable}
                            onChange={(e) => {
                                e.stopPropagation();
                                handleCheckboxChange(item.id, e.target.checked, parentId);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    }
                    label={
                        <Typography
                            variant="body1"
                            sx={{
                                color: item.conditional && !item.applicable ? 'text.disabled' : 'text.primary',
                                fontWeight: 500
                            }}
                        >
                            {item.label}
                            {item.conditional && (
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    (Optional)
                                </Typography>
                            )}
                        </Typography>
                    }
                />

                {item.conditional && (
                    <Box sx={{ ml: 4, mt: 0.5 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={item.applicable}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleApplicableChange(item.id, e.target.checked);
                                    }}
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Applicable
                                </Typography>
                            }
                        />
                    </Box>
                )}

                {item.children && item.children.length > 0 && (
                    <Box sx={{ ml: 4 }}>
                        {item.children.map((child) => renderChecklistItem(child, item.id, level + 1))}
                    </Box>
                )}
            </Box>
        );
    };

    const renderAccordionItem = (item, index) => {
        if (item.children && item.children.length > 0) {
            return (
                <Accordion
                    key={item.id}
                    expanded={expanded[item.id] || false}
                    onChange={handleAccordionChange(item.id)}
                    sx={{ mb: 1 }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${item.id}-content`}
                        id={`panel-${item.id}-header`}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={item.checked}
                                    disabled={item.conditional && !item.applicable}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(item.id, e.target.checked);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            }
                            label={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: item.conditional && !item.applicable ? 'text.disabled' : 'text.primary',
                                        fontWeight: 500
                                    }}
                                >
                                    {item.label}
                                    {item.conditional && (
                                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            (Optional)
                                        </Typography>
                                    )}
                                </Typography>
                            }
                            onClick={(e) => e.stopPropagation()}
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        {item.conditional && (
                            <Box sx={{ ml: 4, mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={item.applicable}
                                            onChange={(e) => handleApplicableChange(item.id, e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            Applicable
                                        </Typography>
                                    }
                                />
                            </Box>
                        )}
                        <FormGroup>
                            {item.children.map((child) => renderChecklistItem(child, item.id, 1))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            );
        } else {
            return renderChecklistItem(item);
        }
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
                        Stage 2: GS Stage
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={selectAll}
                    >
                        Select All
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Complete the following checklist to track your progress through the GS stage.
                </Typography>

                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        Required Documents
                    </Typography>
                    <Box>
                        {checklist.map((item, index) => renderAccordionItem(item, index))}
                    </Box>
                </Paper>
            </CardContent>
        </Card>
    );
}
