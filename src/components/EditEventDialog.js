import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const EditEventDialog = ({ open, data, onClose, onSave, loading }) => {
  const [eventDetails, setEventDetails] = useState(data);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ensure the date is formatted correctly for the date input field
    setEventDetails({
      ...data,
      date: data?.date ? new Date(data.date).toISOString().split("T")[0] : "",
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));

    // Clear the error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!eventDetails.name || eventDetails.name.trim() === "") {
      newErrors.name = "Event name is required.";
    }
    if (!eventDetails.date) {
      newErrors.date = "Date is required.";
    }
    if (!eventDetails.venue || eventDetails.venue.trim() === "") {
      newErrors.venue = "Venue is required.";
    }
    if (!eventDetails.capacity || isNaN(eventDetails.capacity) || eventDetails.capacity <= 0) {
      newErrors.capacity = "Capacity must be a positive number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(eventDetails);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">Edit Event</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Event Name"
          name="name"
          value={eventDetails?.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          name="date"
          type="date"
          value={eventDetails?.date || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.date}
          helperText={errors.date}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Venue"
          name="venue"
          value={eventDetails?.venue || ""}
          onChange={handleChange}
          error={!!errors.venue}
          helperText={errors.venue}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          multiline
          rows={3}
          value={eventDetails?.description || ""}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Capacity"
          name="capacity"
          type="number"
          value={eventDetails?.capacity || ""}
          onChange={handleChange}
          error={!!errors.capacity}
          helperText={errors.capacity}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventDialog;
