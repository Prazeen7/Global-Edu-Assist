import { useState, useEffect } from "react"
import { Box, Card, CardContent, Typography, Checkbox, FormControlLabel, Button, Paper, FormGroup } from "@mui/material"

const initialChecklist = [
    {
        id: "confirmation-enrollment",
        label: "Confirmation of Enrollment letter",
        checked: false,
    },
    {
        id: "visa-application-form",
        label: "Visa application form",
        checked: false,
    },
]

export default function VisaStage({ updateProgress }) {
    const [checklist, setChecklist] = useState(initialChecklist)

    useEffect(() => {
        calculateProgress()
    }, [checklist])

    const calculateProgress = () => {
        let completed = 0
        let total = 0

        const countItems = (items) => {
            for (const item of items) {
                // Only count items that are not conditional or are applicable
                if (!item.conditional || item.applicable) {
                    total++
                    if (item.checked) completed++
                }

                if (item.children) {
                    countItems(item.children)
                }
            }
        }

        countItems(checklist)

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
        updateProgress({ completed, total, percentage })
    }

    const handleCheckboxChange = (id, checked, parentId) => {
        setChecklist((prevChecklist) => {
            const updateItems = (items) => {
                return items.map((item) => {
                    // If this is the item we're looking for
                    if (item.id === id) {
                        // Update children if parent is unchecked
                        let updatedChildren = item.children
                        if (!checked && updatedChildren) {
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

                    // If this item has children, check them too
                    if (item.children) {
                        // If this is the parent of the item we're looking for
                        if (item.id === parentId) {
                            // Check if all children are checked
                            const updatedChildren = updateItems(item.children)
                            const allChildrenChecked = updatedChildren.every((child) => child.checked)

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

                    if (item.children) {
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
                    // Only check items that are not conditional or are applicable
                    const shouldCheck = !item.conditional || item.applicable

                    return {
                        ...item,
                        checked: shouldCheck ? true : item.checked,
                        children: item.children ? updateItems(item.children) : undefined,
                    }
                })
            }

            return updateItems(prevChecklist)
        })
    }

    const renderChecklistItem = (item, parentId, level = 0) => {
        return (
            <Box key={item.id} sx={{ ml: level > 0 ? 4 : 0, mt: 1 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={item.checked}
                            disabled={item.conditional && !item.applicable}
                            onChange={(e) => handleCheckboxChange(item.id, e.target.checked, parentId)}
                        />
                    }
                    label={
                        <Typography
                            variant="body1"
                            sx={{
                                color: item.conditional && !item.applicable ? "text.disabled" : "text.primary",
                                fontWeight: 500,
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
                                    onChange={(e) => handleApplicableChange(item.id, e.target.checked)}
                                    size="small"
                                />
                            }
                            label={<Typography variant="body2">Applicable</Typography>}
                        />
                    </Box>
                )}

                {item.children && (
                    <Box sx={{ ml: 4 }}>{item.children.map((child) => renderChecklistItem(child, item.id, level + 1))}</Box>
                )}
            </Box>
        )
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
                        Stage 4: Visa Stage
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={selectAll}>
                        Select All
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Complete the following checklist to track your progress through the visa stage.
                </Typography>

                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        Required Documents
                    </Typography>
                    <FormGroup>{checklist.map((item) => renderChecklistItem(item))}</FormGroup>
                </Paper>
            </CardContent>
        </Card>
    )
}
