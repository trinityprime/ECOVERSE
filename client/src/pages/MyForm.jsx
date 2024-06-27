import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';//handle validations for forms
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';

const validationSchema = yup.object({
    title: yup.string().trim()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be at most 100 characters')
        .required('Title is required'),
    description: yup.string().trim()
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must be at most 500 characters')
        .required('Description is required'),
    incidentType: yup.string().oneOf(["Environmental Incident", "Resources Management", "Others"]).required('Type of incident is required')
});

function MyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        incidentType: ""
    });

    useEffect(() => {
        if (id) {
            http.get(`/report/${id}`).then((res) => {
                setInitialValues(res.data);
            });
        }
    }, [id]);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            if (id) {
                http.put(`/report/${id}`, data).then(() => {
                    navigate('/reports', { state: { updatedReport: true } });
                });
            } else {
                http.post("/report", data).then(() => {
                    navigate("/reports", { state: { addedReport: true } });
                });
            }
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                {id ? "Edit Report" : "Create a Report"}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="incident-type-label">Type of Incident</InputLabel>
                    <Select
                        labelId="incident-type-label"
                        id="incident-type"
                        name="incidentType"
                        value={formik.values.incidentType}
                        label="Type of Incident"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.incidentType && Boolean(formik.errors.incidentType)}
                    >
                        <MenuItem value="Environmental Incident">Environmental Incident</MenuItem>
                        <MenuItem value="Resources Management">Resources Management</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                    </Select>
                    <FormHelperText>
                        {formik.touched.incidentType && formik.errors.incidentType}
                    </FormHelperText>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        {id ? "Update" : "Add"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default MyForm;