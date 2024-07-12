import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';//
import { useFormik } from 'formik';//handle validations for forms
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';// importing the toast component from the react-toastify library so the import statement can be written.

function AddReport() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            incidentType: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            incidentType: yup.string().oneOf(["Environmental Incident", "Resources Management", "Others"]).required('Type of incident is required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post("/report", data)
            .then((res) => {
                console.log(res.data);
                toast.success('Report added successfully');
                setTimeout(() => {
                    navigate("/reports");
                }, 2000); // Adjust the timeout duration as needed
            })
                .catch((err) => {
                    console.error('Error adding report:', err);
                    toast.error('Error adding report');
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Creating a report
            </Typography>
            <Typography variant="h9" sx={{ my: 0 }}>
                After creating a new report, it will be added to the list.
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                     fullWidth margin="dense" autoComplete="off"//making the margin spacing with vertical spacing and disables autocomplete for input field
                     label="Title"
                     name="title"
                     value={formik.values.title}// Binds the input field value to formik's value for "title"
                     onChange={formik.handleChange}
                     onBlur={formik.handleBlur}// Updates formik's touched status for "title" when the input field loses focus
                     error={formik.touched.title && Boolean(formik.errors.title)}// Displays an error state if the field has been touched and there is an error
                     helperText={formik.touched.title && formik.errors.title} // Displays a helper text (error message) if the field has been touched and there is an error
                />
                <TextField
                   fullWidth margin="dense" autoComplete="off"//making the margin spacing with vertical spacing and disables autocomplete for input field
                   multiline minRows={2}
                   label="Description"
                   name="description"
                   value={formik.values.description}// Binds the input field value to formik's value for "description"
                   onChange={formik.handleChange}
                   onBlur={formik.handleBlur}// Updates formik's touched status for "title" when the input field loses focus
                   error={formik.touched.description && Boolean(formik.errors.description)}// Displays an error state if the field has been touched and there is an error
                   helperText={formik.touched.description && formik.errors.description}// Displays a helper text (error message) if the field has been touched and there is an error
                />
                <FormControl fullWidth margin="dense" sx={{ minWidth: 300 }}>
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
                        helperText={formik.touched.incidentType && formik.errors.incidentType}
                    >
                        <MenuItem value="Environmental Incident">Environmental Incident</MenuItem>
                        <MenuItem value="Resources Management">Resources Management</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                    </Select>
                    {formik.touched.incidentType && formik.errors.incidentType && (
                        <Typography color="error">{formik.errors.incidentType}</Typography>
                    )}
                </FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                        Add
                    </Button>
                    <Link to="/reports" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">
                            Back to Reports
                        </Button>
                    </Link>
                </Box>
            </Box>
            <ToastContainer/>
        </Box>
    );
}

export default AddReport;