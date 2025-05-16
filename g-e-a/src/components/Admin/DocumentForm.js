"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import Alert from "@mui/material/Alert"

function DocumentForm({ initialData = null, onSave }) {
    const [formData, setFormData] = useState({
        document: "",
        docs: [""],
        src: [""],
        info: [""],
    })
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")

    useEffect(() => {
        if (initialData) {
            setFormData({
                document: initialData.document || "",
                docs: initialData.docs || [""],
                src: initialData.src || [""],
                info: initialData.info || [""],
            })
        }
    }, [initialData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const handleArrayChange = (index, field, value) => {
        const newArray = [...formData[field]]
        newArray[index] = value
        setFormData({
            ...formData,
            [field]: newArray,
        })
        // Clear error when field is edited
        if (errors[`${field}[${index}]`]) {
            setErrors({
                ...errors,
                [`${field}[${index}]`]: "",
            })
        }
    }

    const addItem = () => {
        setFormData({
            ...formData,
            docs: [...formData.docs, ""],
            src: [...formData.src, ""],
            info: [...formData.info, ""],
        })
    }

    const removeItem = (index) => {
        if (formData.docs.length <= 1) {
            setFormError("At least one document is required")
            return
        }

        setFormData({
            ...formData,
            docs: formData.docs.filter((_, i) => i !== index),
            src: formData.src.filter((_, i) => i !== index),
            info: formData.info.filter((_, i) => i !== index),
        })

        // Remove any errors for this index
        const newErrors = { ...errors }
        delete newErrors[`docs[${index}]`]
        delete newErrors[`src[${index}]`]
        delete newErrors[`info[${index}]`]
        setErrors(newErrors)
    }

    const validateForm = () => {
        const newErrors = {}
        let isValid = true

        // Validate document title
        if (!formData.document.trim()) {
            newErrors.document = "Document title is required"
            isValid = false
        }

        // Validate each document item
        formData.docs.forEach((doc, index) => {
            if (!doc.trim()) {
                newErrors[`docs[${index}]`] = "Document name is required"
                isValid = false
            }
        })

        // Validate each source item
        formData.src.forEach((src, index) => {
            if (!src.trim()) {
                newErrors[`src[${index}]`] = "Source is required"
                isValid = false
            }
        })

        // Validate each info item
        formData.info.forEach((info, index) => {
            if (!info.trim()) {
                newErrors[`info[${index}]`] = "Information is required"
                isValid = false
            }
        })

        // Check if arrays have the same length
        const lengths = [formData.docs.length, formData.src.length, formData.info.length]
        if (new Set(lengths).size !== 1) {
            setFormError("Document, source, and information arrays must have the same length")
            isValid = false
        } else {
            setFormError("")
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            onSave(formData)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                </Alert>
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                id="document"
                label="Document Title"
                name="document"
                value={formData.document}
                onChange={handleChange}
                error={!!errors.document}
                helperText={errors.document}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Document Requirements
            </Typography>

            {formData.docs.map((doc, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            label="Document Name"
                            value={doc}
                            onChange={(e) => handleArrayChange(index, "docs", e.target.value)}
                            error={!!errors[`docs[${index}]`]}
                            helperText={errors[`docs[${index}]`]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            fullWidth
                            label="Source"
                            value={formData.src[index] || ""}
                            onChange={(e) => handleArrayChange(index, "src", e.target.value)}
                            error={!!errors[`src[${index}]`]}
                            helperText={errors[`src[${index}]`]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            label="Information"
                            value={formData.info[index] || ""}
                            onChange={(e) => handleArrayChange(index, "info", e.target.value)}
                            error={!!errors[`info[${index}]`]}
                            helperText={errors[`info[${index}]`]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton onClick={() => removeItem(index)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<AddIcon />} onClick={addItem} variant="outlined" sx={{ mt: 1, mb: 3 }}>
                Add Document
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="primary">
                    {initialData ? "Update Document" : "Save Document"}
                </Button>
            </Box>
        </Box>
    )
}

export default DocumentForm
