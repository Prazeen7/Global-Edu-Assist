"use client"

import { useState, useEffect } from "react"
import { Box, Card, CardContent, CardHeader, Typography, Checkbox, Button, Chip, Collapse } from "@mui/material"
import { styled } from "@mui/material/styles"
import { CheckCircle as CheckCircleIcon, RemoveCircleOutline as DeselectIcon } from "@mui/icons-material"

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: "#5B5FEF",
    color: "#fff",
    padding: theme.spacing(2, 3),
}))

const ChecklistItemContainer = styled(Box)(({ theme, checked, level = 0 }) => ({
    padding: theme.spacing(0.75, 0),
    marginLeft: level > 0 ? theme.spacing(level * 2) : 0,
    borderBottom: level === 0 ? "1px solid rgba(0, 0, 0, 0.06)" : "none",
    "&:last-child": {
        borderBottom: "none",
    },
    opacity: checked ? 0.7 : 1,
    transition: "opacity 0.2s ease-in-out",
}))

export default function COEStage({ items = [], updateProgress }) {
    const [checklist, setChecklist] = useState(
        items.length > 0
            ? items
            : [
                // Default items if none provided
                {
                    id: "swift-copy",
                    label: "Swift Copy of paid tuition fee",
                    checked: false,
                },
                {
                    id: "disbursement-letter",
                    label: "Disbursement letter / Loan Account statement after fee payment if bank loan",
                    checked: false,
                    conditional: true,
                    applicable: false,
                },
                {
                    id: "oshc",
                    label: "Overseas Student Health Cover (OSHC)",
                    checked: false,
                },
            ],
    )

    useEffect(() => {
        // Update progress whenever checklist changes
        calculateProgress()
    }, [checklist])

    // Update component if items prop changes
    useEffect(() => {
        if (items && items.length > 0) {
            setChecklist(items)
        }
    }, [items])

    const calculateProgress = () => {
        let completed = 0
        let total = 0

        const countItems = (items) => {
            for (const item of items) {
                if (!item.conditional || item.applicable) {
                    total++
                    if (item.checked) completed++
                }

                if (item.children && item.children.length > 0) {
                    countItems(item.children)
                }
            }
        }

        countItems(checklist)

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
        updateProgress({ completed, total, percentage, items: checklist })
    }

    const handleCheckboxChange = (id, checked, parentId) => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    if (item.id === id) {
                        let updatedChildren = item.children
                        if (!checked && updatedChildren && updatedChildren.length > 0) {
                            updatedChildren = updatedChildren.map((child) => ({
                                ...child,
                                checked: false,
                            }))
                        }

                        return {
                            ...item,
                            checked,
                            children: updatedChildren,
                        }
                    }

                    if (item.children && item.children.length > 0) {
                        if (item.id === parentId) {
                            const updatedChildren = updateItems(item.children)
                            const allChildrenChecked = updatedChildren.every((child) =>
                                child.conditional && !child.applicable ? true : child.checked,
                            )

                            return {
                                ...item,
                                children: updatedChildren,
                                checked: allChildrenChecked,
                            }
                        }

                        return {
                            ...item,
                            children: updateItems(item.children),
                        }
                    }

                    return item
                })
            }

            return updateItems(prevChecklist)
        })
    }

    const handleApplicableChange = (id, applicable) => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            applicable,
                            checked: applicable ? item.checked : false,
                        }
                    }

                    if (item.children && item.children.length > 0) {
                        return {
                            ...item,
                            children: updateItems(item.children),
                        }
                    }

                    return item
                })
            }

            return updateItems(prevChecklist)
        })
    }

    const selectAll = () => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    const shouldCheck = !item.conditional || item.applicable

                    return {
                        ...item,
                        checked: shouldCheck ? true : item.checked,
                        children: item.children && item.children.length > 0 ? updateItems(item.children) : item.children,
                    }
                })
            }

            return updateItems(prevChecklist)
        })
    }

    const deselectAll = () => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    return {
                        ...item,
                        checked: false,
                        children: item.children && item.children.length > 0 ? updateItems(item.children) : item.children,
                    }
                })
            }

            return updateItems(prevChecklist)
        })
    }

    const renderChecklistItem = (item, parentId, level = 0) => {
        const hasChildren = item.children && item.children.length > 0

        return (
            <ChecklistItemContainer key={item.id} checked={item.checked} level={level}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box sx={{ pt: 0.5 }}>
                        <Checkbox
                            id={item.id}
                            checked={item.checked}
                            disabled={item.conditional && !item.applicable}
                            onChange={(e) => handleCheckboxChange(item.id, e.target.checked, parentId)}
                            sx={{
                                color: "#e0e0e0",
                                "&.Mui-checked": {
                                    color: "#5B5FEF",
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="body2"
                                component="label"
                                htmlFor={item.id}
                                sx={{
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    color: item.conditional && !item.applicable ? "text.disabled" : "text.primary",
                                    textDecoration: item.checked ? "line-through" : "none",
                                    ...(item.checked && { color: "text.secondary" }),
                                }}
                            >
                                {item.label}
                            </Typography>

                            {item.conditional && (
                                <Chip
                                    label="Optional"
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontSize: "0.75rem",
                                        fontWeight: "normal",
                                        bgcolor: "rgba(91, 95, 239, 0.05)",
                                        color: "#5B5FEF",
                                        borderColor: "rgba(91, 95, 239, 0.3)",
                                        "&:hover": {
                                            bgcolor: "rgba(91, 95, 239, 0.05)",
                                        },
                                    }}
                                />
                            )}
                        </Box>

                        {item.conditional && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75, ml: 0.5 }}>
                                <Checkbox
                                    id={`applicable-${item.id}`}
                                    checked={item.applicable}
                                    onChange={(e) => handleApplicableChange(item.id, e.target.checked)}
                                    size="small"
                                    sx={{
                                        p: 0.5,
                                        color: "#e0e0e0",
                                        "&.Mui-checked": {
                                            color: "#5B5FEF",
                                        },
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    component="label"
                                    htmlFor={`applicable-${item.id}`}
                                    sx={{ color: "#5B5FEF", cursor: "pointer" }}
                                >
                                    Applicable to me
                                </Typography>
                            </Box>
                        )}

                        {hasChildren && (
                            <Collapse in={true}>
                                <Box sx={{ mt: 1 }}>{item.children.map((child) => renderChecklistItem(child, item.id, level + 1))}</Box>
                            </Collapse>
                        )}
                    </Box>
                </Box>
            </ChecklistItemContainer>
        )
    }

    return (
        <Card sx={{ boxShadow: 3, border: "none" }}>
            <StyledCardHeader
                title={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                Stage 3: COE Stage
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", mt: 0.5 }}>
                                Complete the following checklist to track your progress through the COE stage
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<CheckCircleIcon />}
                                onClick={selectAll}
                                sx={{
                                    bgcolor: "#fff",
                                    color: "#5B5FEF",
                                    fontWeight: 500,
                                    "&:hover": {
                                        bgcolor: "rgba(255, 255, 255, 0.9)",
                                    },
                                }}
                            >
                                Select All
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DeselectIcon />}
                                onClick={deselectAll}
                                sx={{
                                    bgcolor: "transparent",
                                    color: "#fff",
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    fontWeight: 500,
                                    "&:hover": {
                                        bgcolor: "rgba(255, 255, 255, 0.1)",
                                        borderColor: "#fff",
                                    },
                                }}
                            >
                                Deselect All
                            </Button>
                        </Box>
                    </Box>
                }
            />

            <CardContent sx={{ p: 3 }}>
                <Card variant="outlined" sx={{ overflow: "hidden" }}>
                    <Box sx={{ bgcolor: "rgba(0, 0, 0, 0.04)", px: 2, py: 1.5, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
                        <Typography variant="subtitle1" fontWeight={600} color="#5B5FEF">
                            Required Documents
                        </Typography>
                    </Box>

                    <Box sx={{ p: 2 }}>{checklist.map((item) => renderChecklistItem(item))}</Box>
                </Card>
            </CardContent>
        </Card>
    )
}
