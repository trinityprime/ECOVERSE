import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';//handle validations for forms
import * as yup from 'yup';
import { toast } from 'react-toastify';

function EditReport() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState({
        title: "",
        description: "",
        incidentType: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/report/${id}`)
            .then((res) => {
                setReport(res.data);
                setLoading(false);
            })
            .catch(() => {
                navigate('/reports');
            });
    }, [id, navigate]);

    const formik = useFormik({
        initialValues: report,
        enableReinitialize: true,
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
            handleUpdateOpen();
        }
    });

    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleUpdateOpen = () => setOpenUpdate(true);
    const handleUpdateClose = () => setOpenUpdate(false);
    const handleDeleteOpen = () => setOpenDelete(true);
    const handleDeleteClose = () => setOpenDelete(false);

    const handleUpdate = () => {
        http.put(`/report/${id}`, formik.values)
            .then(() => {
                setOpenUpdate(false);
                toast.success('Report updated successfully');
                navigate('/reports');
            })
            .catch((err) => {
                console.error('Error updating report:', err);
                toast.error('Error updating report');
            });
    };

    const handleDelete = () => {
        http.delete(`/report/${id}`)
            .then(() => {
                setOpenDelete(false);
                toast.success('Report deleted successfully');
                navigate('/reports');
            })
            .catch((err) => {
                console.error('Error deleting report:', err);
                toast.error('Error deleting report');
            });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Report
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
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
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" type="submit">
                            Save
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleDeleteOpen}>
                            Delete
                        </Button>
                    </Box>
                    <Dialog open={openUpdate} onClose={handleUpdateClose}>
                        <DialogTitle>Update Confirmation</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Are you sure you want to update this report?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleUpdateClose}>Cancel</Button>
                            <Button onClick={handleUpdate} variant="contained">Update</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openDelete} onClose={handleDeleteClose}>
                        <DialogTitle>Delete Confirmation</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete this report?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteClose}>Cancel</Button>
                            <Button onClick={handleDelete} variant="outlined" color="error">Delete</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            )}
        </Box>
    );
}

export default EditReport;