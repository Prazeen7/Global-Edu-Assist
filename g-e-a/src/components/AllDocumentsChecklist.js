import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Checkbox,
    Chip,
    IconButton,
    Collapse,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
    KeyboardArrowDown as ChevronDownIcon,
    KeyboardArrowRight as ChevronRightIcon,
    ExpandMore as ExpandMoreIcon,
    Description as DocumentIcon,
    School as SchoolIcon,
    Flight as FlightIcon,
    Work as WorkIcon,
    CheckCircle as CheckCircleIcon,
    RemoveCircleOutline as DeselectIcon,
} from "@mui/icons-material"

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: "#5B5FEF",
    color: "#fff",
    padding: theme.spacing(2, 3),
}))

const StageAccordion = styled(Accordion)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    "&:before": {
        display: "none",
    },
    borderRadius: "8px",
    overflow: "hidden",
}))

const StageAccordionSummary = styled(AccordionSummary)(({ theme, completed }) => ({
    backgroundColor: completed ? "rgba(76, 175, 80, 0.1)" : "rgba(91, 95, 239, 0.05)",
    borderLeft: completed ? "4px solid #4CAF50" : "4px solid #5B5FEF",
    "& .MuiAccordionSummary-content": {
        margin: theme.spacing(1, 0),
    },
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

export default function AllDocumentsChecklist({ stageProgress, updateStageProgress }) {
    const [expandedStages, setExpandedStages] = useState({
        offer: true,
        gs: true,
        coe: true,
        visa: true,
    })

    const [openItems, setOpenItems] = useState({})

    const getStageIcon = (stage) => {
        switch (stage) {
            case "offer":
                return <SchoolIcon />
            case "gs":
                return <DocumentIcon />
            case "coe":
                return <WorkIcon />
            case "visa":
                return <FlightIcon />
            default:
                return <DocumentIcon />
        }
    }

    const getStageName = (stage) => {
        switch (stage) {
            case "offer":
                return "Offer Stage"
            case "gs":
                return "GS Stage"
            case "coe":
                return "COE Stage"
            case "visa":
                return "Visa Stage"
            default:
                return stage
        }
    }

    const handleStageToggle = (stage) => {
        setExpandedStages((prev) => ({
            ...prev,
            [stage]: !prev[stage],
        }))
    }

    const toggleCollapsible = (id) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleCheckboxChange = (stage, id, checked, parentId) => {
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

        // Create a copy of the items for the specific stage
        const updatedItems = updateItems([...stageProgress[stage].items])

        // Calculate progress for this stage
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

        countItems(updatedItems)
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        // Update the stage progress
        updateStageProgress(stage, { completed, total, percentage }, updatedItems)
    }

    const handleApplicableChange = (stage, id, applicable) => {
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

        // Create a copy of the items for the specific stage
        const updatedItems = updateItems([...stageProgress[stage].items])

        // Calculate progress for this stage
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

        countItems(updatedItems)
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        // Update the stage progress
        updateStageProgress(stage, { completed, total, percentage }, updatedItems)
    }

    const selectAll = (stage) => {
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

        // Create a copy of the items for the specific stage
        const updatedItems = updateItems([...stageProgress[stage].items])

        // Calculate progress for this stage
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

        countItems(updatedItems)
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        // Update the stage progress
        updateStageProgress(stage, { completed, total, percentage }, updatedItems)
    }

    const deselectAll = (stage) => {
        const updateItems = (items) => {
            return items.map((item) => {
                return {
                    ...item,
                    checked: false,
                    children: item.children && item.children.length > 0 ? updateItems(item.children) : item.children,
                }
            })
        }

        // Create a copy of the items for the specific stage
        const updatedItems = updateItems([...stageProgress[stage].items])

        // Calculate progress for this stage
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

        countItems(updatedItems)
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        // Update the stage progress
        updateStageProgress(stage, { completed, total, percentage }, updatedItems)
    }

    const renderChecklistItem = (stage, item, parentId, level = 0) => {
        const hasChildren = item.children && item.children.length > 0
        const isOpen = openItems[item.id]

        return (
            <ChecklistItemContainer key={item.id} checked={item.checked} level={level}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box sx={{ pt: 0.5 }}>
                        <Checkbox
                            id={`${stage}-${item.id}`}
                            checked={item.checked}
                            disabled={item.conditional && !item.applicable}
                            onChange={(e) => handleCheckboxChange(stage, item.id, e.target.checked, parentId)}
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
                                htmlFor={`${stage}-${item.id}`}
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

                            {hasChildren && (
                                <IconButton size="small" sx={{ ml: "auto", p: 0.5 }} onClick={() => toggleCollapsible(item.id)}>
                                    {isOpen ? <ChevronDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                                </IconButton>
                            )}
                        </Box>

                        {item.conditional && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75, ml: 0.5 }}>
                                <Checkbox
                                    id={`applicable-${stage}-${item.id}`}
                                    checked={item.applicable}
                                    onChange={(e) => handleApplicableChange(stage, item.id, e.target.checked)}
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
                                    htmlFor={`applicable-${stage}-${item.id}`}
                                    sx={{ color: "#5B5FEF", cursor: "pointer" }}
                                >
                                    Applicable to me
                                </Typography>
                            </Box>
                        )}

                        {hasChildren && (
                            <Collapse in={isOpen}>
                                <Box sx={{ mt: 1 }}>
                                    {item.children.map((child) => renderChecklistItem(stage, child, item.id, level + 1))}
                                </Box>
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
                                Complete Documents Checklist
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", mt: 0.5 }}>
                                All required documents across all stages of your application process
                            </Typography>
                        </Box>
                    </Box>
                }
            />

            <CardContent sx={{ p: 3 }}>
                {Object.keys(stageProgress).map((stage) => (
                    <StageAccordion
                        key={stage}
                        expanded={expandedStages[stage]}
                        onChange={() => handleStageToggle(stage)}
                        disableGutters
                    >
                        <StageAccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${stage}-content`}
                            id={`${stage}-header`}
                            completed={stageProgress[stage].percentage === 100}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        bgcolor:
                                            stageProgress[stage].percentage === 100 ? "rgba(76, 175, 80, 0.1)" : "rgba(91, 95, 239, 0.1)",
                                        color: stageProgress[stage].percentage === 100 ? "#4CAF50" : "#5B5FEF",
                                    }}
                                >
                                    {getStageIcon(stage)}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {getStageName(stage)}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {stageProgress[stage].completed} of {stageProgress[stage].total} documents
                                        </Typography>
                                        <Chip
                                            label={`${stageProgress[stage].percentage}%`}
                                            size="small"
                                            color={stageProgress[stage].percentage === 100 ? "success" : "primary"}
                                            sx={{
                                                height: 20,
                                                fontSize: "0.7rem",
                                                bgcolor: stageProgress[stage].percentage === 100 ? "#4CAF50" : "#5B5FEF",
                                                color: "#fff",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </StageAccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <Box sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => selectAll(stage)}
                                        sx={{
                                            color: "#5B5FEF",
                                            borderColor: "#5B5FEF",
                                        }}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<DeselectIcon />}
                                        onClick={() => deselectAll(stage)}
                                        sx={{
                                            color: "#666",
                                            borderColor: "#ccc",
                                        }}
                                    >
                                        Deselect All
                                    </Button>
                                </Box>
                                {stageProgress[stage].items.map((item) => renderChecklistItem(stage, item))}
                            </Box>
                        </AccordionDetails>
                    </StageAccordion>
                ))}
            </CardContent>
        </Card>
    )
}
