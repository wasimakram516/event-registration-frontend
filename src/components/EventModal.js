import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import apiClient from "../api/apiClient";
import { useSnackbar } from "../context/SnackbarProvider"; // Import useSnackbar

const EventModal = ({ open, onClose, event, fetchEvents }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const showSnackbar = useSnackbar(); // Use Snackbar from context

  // Update formData whenever the event prop changes
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "",
        venue: event.venue || "",
        description: event.description || "",
        logo: null,
      });
    } else {
      setFormData({
        name: "",
        date: "",
        venue: "",
        description: "",
        logo: null,
      });
    }
  }, [event]);

  // Clear error when input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    setError(null); // Clear error when the user starts typing
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.date || !formData.venue) {
      setError("Please fill all the required fields.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append("description", formData.description);
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      if (event) {
        await apiClient.put(`/events/${event._id}`, formDataToSend);
        showSnackbar("Event updated successfully!", "success");
      } else {
        await apiClient.post("/events", formDataToSend);
        showSnackbar("Event created successfully!", "success");
      }

      fetchEvents();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save event.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        {event ? "Edit Event" : "Create Event"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          name="name"
          label="Event Name"
          value={formData.name}
          onChange={handleInputChange}
          sx={{ my: 2 }}
        />
        <TextField
          fullWidth
          name="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="venue"
          label="Venue"
          value={formData.venue}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="logo"
          type="file"
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : event ? (
            "Save Changes"
          ) : (
            "Create Event"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
