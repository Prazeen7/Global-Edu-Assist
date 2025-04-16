import { useState, useEffect } from "react"
import { 
    Box, Card, CardContent, Typography, Checkbox, FormControlLabel, Button, Paper, FormGroup,
    Chip
} from "@mui/material"

export default function OfferStage({ updateProgress }) {
    const [checklist, setChecklist] = useState([
        {
            id: "passport",
            label: "Passport submitted",
            checked: false,
            children: [
                {
                    id: "old-passport",
                    label: "Old passport (if available)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                },
                {
                    id: "immigration-history",
                    label: "Disclose all immigration history",
                    checked: false,
                    conditional: true,
                    applicable: false,
                },
            ],
        },
        {
            id: "academic-docs",
            label: "Academic Documents submitted",
            checked: false,
        },
        {
            id: "cv",
            label: "CV",
            checked: false,
        },
        {
            id: "english-test",
            label: "English Proficiency Test Score (if any)",
            checked: false,
            conditional: true,
            applicable: false,
        },
        {
            id: "work-experience",
            label: "Work experience/Internships (if any)",
            checked: false,
            conditional: true,
            applicable: false,
        },
    ]);

    useEffect(() => {
        calculateProgress();
    }, [checklist]);

    const calculateProgress = () => {
        let completed = 0;
        let total = 0;

        const countItems = (items) => {
            for (const item of items) {
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
                    if (item.id === id) {
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

                    if (item.children) {
                        if (item.id === parentId) {
                            const updatedChildren = updateItems(item.children);
                            const allChildrenChecked = updatedChildren.every((child) => child.checked);

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
                        return {
                            ...item,
                            applicable,
                            checked: applicable ? item.checked : false,
                        };
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

    const renderChecklistItem = (item, parentId, level = 0) => {
        return (
            <Box key={item.id} sx={{ 
                ml: level > 0 ? 4 : 0, 
                mt: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: level > 0 ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                borderLeft: level > 0 ? `3px solid #4f46e5` : 'none'
            }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={item.checked}
                            disabled={item.conditional && !item.applicable}
                            onChange={(e) => handleCheckboxChange(item.id, e.target.checked, parentId)}
                            sx={{
                                color: item.conditional && !item.applicable ? 'action.disabled' : '#4f46e5',
                                '&.Mui-checked': {
                                    color: '#4f46e5',
                                },
                            }}
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: item.conditional && !item.applicable ? "text.disabled" : "text.primary",
                                    fontWeight: 500,
                                }}
                            >
                                {item.label}
                            </Typography>
                            {item.conditional && (
                                <Chip
                                    label="Optional"
                                    size="small"
                                    sx={{ 
                                        ml: 1, 
                                        bgcolor: 'rgba(79, 70, 229, 0.1)',
                                        color: '#4f46e5',
                                        fontSize: '0.7rem'
                                    }}
                                />
                            )}
                        </Box>
                    }
                />

                {item.conditional && (
                    <Box sx={{ ml: 4, mt: 0.5 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={item.applicable}
                                    onChange={(e) => handleApplicableChange(item.id, e.target.checked)}
                                    size="small"
                                    sx={{
                                        color: '#4f46e5',
                                        '&.Mui-checked': {
                                            color: '#4f46e5',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: '#4f46e5', fontWeight: 500 }}>
                                    Applicable to me
                                </Typography>
                            }
                        />
                    </Box>
                )}

                {item.children && (
                    <Box sx={{ ml: 2 }}>
                        {item.children.map((child) => renderChecklistItem(child, item.id, level + 1))}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Card sx={{ 
            border: 'none',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            borderRadius: 3,
            overflow: 'hidden'
        }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    bgcolor: '#4f46e5',
                    color: 'white'
                }}>
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        mb: 2 
                    }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                            Stage 1: Offer Stage
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={selectAll}
                            sx={{
                                bgcolor: 'white',
                                color: '#4f46e5',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                }
                            }}
                        >
                            Select All
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Complete the following checklist to track your progress through the offer stage.
                    </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Paper variant="outlined" sx={{ 
                        borderRadius: 2,
                        borderColor: 'rgba(79, 70, 229, 0.3)',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ 
                            p: 2.5, 
                            bgcolor: 'rgba(79, 70, 229, 0.05)',
                            borderBottom: '1px solid rgba(79, 70, 229, 0.1)'
                        }}>
                            <Typography variant="h6" component="h3" sx={{ 
                                fontWeight: 600,
                                color: '#4f46e5'
                            }}>
                                Required Documents
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <FormGroup>
                                {checklist.map((item) => renderChecklistItem(item))}
                            </FormGroup>
                        </Box>
                    </Paper>
                </Box>
            </CardContent>
        </Card>
    );
}