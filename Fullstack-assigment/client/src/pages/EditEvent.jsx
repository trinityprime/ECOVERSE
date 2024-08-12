import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [event, setEvent] = useState({
    // Initial state
    eventName: "",
    eventType: "",
    eventDate: "",
    eventTimeFrom: "",
    eventTimeTo: "",
    location: "",
    maxParticipants: 0,
    organizerDetails: "",
    eventDescription: "",
    termsAndConditions: "",
    eventType: "",
    eventStatus: "",
    eventImage: "",
  });


  const locationOptions = [
    { value: "North East", label: "North East" },
    { value: "North", label: "North" },
    { value: "East", label: "East" },
    { value: "West", label: "West" },
    { value: "Central", label: "Central" },
  ];

  const eventTypeOptions = [
    { value: "Workshop", label: "Workshop" },
    { value: "Conference", label: "Conference" },
    { value: "Sports Event", label: "Sports Event" },
    { value: "Eco-Marketplace", label: "Eco-Marketplace" },
    { value: "Exhibition", label: "Exhibition" },
    { value: "Volunteering", label: "Volunteering" },
    { value: "Charity Event", label: "Charity Event" },
    { value: "Social Event", label: "Social Event" },
    { value: "Seminar", label: "Seminar" },
    { value: "Sustainability Festival", label: "Sustainability Festival" },
    { value: "Others", label: "Other" },
  ];

  const eventStatusOptions = [
    { value: "Ongoing", label: "Ongoing" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Completed", label: "Completed" },
    { value: "Postponed", label: "Postponed" },
  ];

  // Fetch event data
  useEffect(() => {
    http.get(`/event/${id}`)
      .then((res) => {
        console.log("Fetched event data:", res.data);
        setEvent(res.data);
        setImageFile(res.data.imageFile); // Update imageFile state
        setLoading(false);
        formik.setValues({
          // Set formik values
          eventName: res.data.eventName,
          eventDate: res.data.eventDate,
          eventTimeFrom: res.data.eventTimeFrom,
          eventTimeTo: res.data.eventTimeTo,
          location: res.data.location,
          maxParticipants: res.data.maxParticipants,
          organizerDetails: res.data.organizerDetails,
          eventDescription: res.data.eventDescription,
          termsAndConditions: res.data.termsAndConditions,
          eventType: res.data.eventType,
          eventStatus: res.data.eventStatus,
        });
      })
      .catch((error) => {
        toast.error("Failed to fetch event details");
        console.error("Error fetching event details:", error);
        setLoading(false);
      });
  }, [id]);


  const formik = useFormik({
    initialValues: event, 
    enableReinitialize: true,
    validationSchema: yup.object({
      eventName: yup
        .string()
        .trim()
        .min(3, "Event Name must be at least 3 characters")
        .max(100, "Event Name must be at most 100 characters")
        .required("Event Name is required"),
      eventDate: yup.date()
        .typeError('Incorrect format for Event Date')
        .min(new Date(2024, 0, 1), 'Event Date must be in the year 2024 or later')
        .max(new Date(2099, 11, 31), 'Event Date must be in the year 2099 or earlier')
        .required('Event Date is required'),
      eventTimeFrom: yup.string().trim().required("Start Time is required"),
      eventTimeTo: yup.string().trim().required("End Time is required"),
      location: yup.string().trim().required("Location is required"),
      maxParticipants: yup
        .number()
        .integer()
        .min(1, "Must be at least 1 participant")
        .required("Maximum Participants are required"),
      organizerDetails: yup
        .string()
        .trim()
        .required("Organizer Details are required"),
      eventDescription: yup
        .string()
        .trim()
        .required("Event Description is required"),
      termsAndConditions: yup
        .string()
        .trim()
        .required("Terms and Conditions are required"),
      eventType: yup.string().trim().required("Event Type is required"),
      eventStatus: yup.string().trim().required("Event Status is required"),
      eventImage: "",
    }),

    onSubmit: (data) => {
      // Trim strings before submission
      data.eventName = data.eventName.trim();
      data.location = data.location.trim();
      data.organizerDetails = data.organizerDetails.trim();
      data.eventDescription = data.eventDescription.trim();
      data.termsAndConditions = data.termsAndConditions.trim();



      // Update event data with PUT request
      http
        .put(`/event/${id}`, data)
        .then(() => {
          toast.success(`Event ID ${id} has been updated successfully`);
          setTimeout(() => {
            navigate(`/event-details/${id}`);
          }, 1400);
        })
        .catch((error) => {
          toast.error(`Failed to update event ${id}`);
          console.error(`Error updating event ${id}:`, error);
        });
    },

    // onSubmit: (values) => {
    //   http
    //     .put(`/event/${id}`, { ...values, imageFile: imageFile })
    //     .then(() => {
    //       toast.success(`Event ID ${id} has been updated successfully`);
    //       navigate(`/event-details/${id}`);
    //     })
    //     .catch((error) => {
    //       toast.error(`Failed to update event ${id}`);
    //       console.error(`Error updating event ${id}:`, error);
    //     });
    // },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteEvent = () => {
    http
      .delete(`/event/${id}`)
      .then(() => {
        toast.success(`Event ID ${id} has been successfully deleted.`);
        navigate("/AdminECManagement");
      })
      .catch((error) => {
        toast.error(`Failed to delete event ID ${id}.`);
        console.error("Error deleting event:", error);
      });
  };


  // Function to handle file change (upload)
  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Update formik values with new image filename
          formik.setFieldValue("eventImage", res.data.filename);
          // Also update the event state to display the new image
          setEvent({ ...event, imageFile: res.data.filename }); // Fix this line
        })
        .catch((error) => {
          toast.error("Failed to upload image");
          console.error("Error uploading image:", error);
        });
    }
  };



  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Event
      </Typography>
      {!loading && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={8}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Event Name"
                name="eventName"
                value={formik.values.eventName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.eventName && Boolean(formik.errors.eventName)
                }
                helperText={formik.touched.eventName && formik.errors.eventName}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="eventType-label">Event Type</InputLabel>
                <Select
                  labelId="eventType-label"
                  id="eventType"
                  name="eventType"
                  value={formik.values.eventType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.eventType && Boolean(formik.errors.eventType)
                  }
                  label="Event Type"
                >
                  <MenuItem value="">Select Event Type</MenuItem>
                  {eventTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.eventType && formik.errors.eventType && (
                  <Typography variant="caption" color="error">
                    {formik.errors.eventType}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                multiline
                minRows={2}
                label="Event Description"
                name="eventDescription"
                value={formik.values.eventDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.eventDescription &&
                  Boolean(formik.errors.eventDescription)
                }
                helperText={
                  formik.touched.eventDescription &&
                  formik.errors.eventDescription
                }
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                type="date"
                label="Event Date"
                name="eventDate"
                value={formik.values.eventDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.eventDate && Boolean(formik.errors.eventDate)
                }
                helperText={formik.touched.eventDate && formik.errors.eventDate}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                type="time"
                label="Start Time"
                name="eventTimeFrom"
                value={formik.values.eventTimeFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.eventTimeFrom &&
                  Boolean(formik.errors.eventTimeFrom)
                }
                helperText={
                  formik.touched.eventTimeFrom && formik.errors.eventTimeFrom
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                type="time"
                label="End Time"
                name="eventTimeTo"
                value={formik.values.eventTimeTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.eventTimeTo &&
                  Boolean(formik.errors.eventTimeTo)
                }
                helperText={
                  formik.touched.eventTimeTo && formik.errors.eventTimeTo
                }
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  id="location"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                  label="Location"
                >
                  <MenuItem value="">Select Location</MenuItem>
                  {locationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.location && formik.errors.location && (
                  <Typography variant="caption" color="error">
                    {formik.errors.location}
                  </Typography>
                )}
              </FormControl>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                type="number"
                label="Max Participants"
                name="maxParticipants"
                value={formik.values.maxParticipants}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.maxParticipants &&
                  Boolean(formik.errors.maxParticipants)
                }
                helperText={
                  formik.touched.maxParticipants &&
                  formik.errors.maxParticipants
                }
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Organizer Details"
                name="organizerDetails"
                value={formik.values.organizerDetails}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.organizerDetails &&
                  Boolean(formik.errors.organizerDetails)
                }
                helperText={
                  formik.touched.organizerDetails &&
                  formik.errors.organizerDetails
                }
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                multiline
                minRows={2}
                label="Terms and Conditions"
                name="termsAndConditions"
                value={formik.values.termsAndConditions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.termsAndConditions &&
                  Boolean(formik.errors.termsAndConditions)
                }
                helperText={
                  formik.touched.termsAndConditions &&
                  formik.errors.termsAndConditions
                }
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="event-status-label">Event Status</InputLabel>
                <Select
                  labelId="event-status-label"
                  id="eventStatus"
                  name="eventStatus"
                  value={formik.values.eventStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.eventStatus &&
                    Boolean(formik.errors.eventStatus)
                  }
                  label="Event Status"
                >
                  <MenuItem value="">Select Event Status</MenuItem>
                  {eventStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.eventStatus && formik.errors.eventStatus && (
                  <Typography variant="caption" color="error">
                    {formik.errors.eventStatus}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ textAlign: "center" }}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input hidden accept="image/*" type="file" onChange={onFileChange} />
                </Button>
                {event.imageFile && (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img
                      alt="event"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                {!event.imageFile && (
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    No image available for this event.
                  </Typography>
                )}
                {formik.values.eventImage && (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img
                      alt="event"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${formik.values.eventImage}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>


          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
            >
              Delete
            </Button>
          </Box>
        </form>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default EditEvent;