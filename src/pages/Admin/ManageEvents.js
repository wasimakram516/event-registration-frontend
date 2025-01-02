import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, Share } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import EventModal from "../../components/EventModal";
import ShareEventDialog from "../../components/ShareEventDialog";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useSnackbar } from "../../context/SnackbarProvider";
import { formatDate, getEventStatus } from "../../utils/dateUtils";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/events");
      setEvents(response.data);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to fetch events.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const handleOpenModal = (event = null) => {
    setCurrentEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  const handleOpenShareDialog = (event) => {
    setCurrentEvent(event);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleOpenConfirmation = (action) => {
    setConfirmationAction(() => action);
    setConfirmationOpen(true);
  };

  const handleDelete = async (eventId) => {
    try {
      await apiClient.delete(`/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
      showSnackbar("Event deleted successfully.", "success");
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to delete event.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
        Manage Events
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, color: "text.secondary", textAlign: "center" }}
      >
        Create, update, and manage your events effortlessly. You can also view event details and share them with others.
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => handleOpenModal()}
      >
        Create Event
      </Button>

      {loading && <CircularProgress />}
      {!loading && events.length === 0 && (
        <Typography>No events found. Create your first event!</Typography>
      )}
      {!loading && events.length > 0 && (
        <Grid container spacing={4}>
          {events.map((event) => {
            const eventStatus = getEventStatus(event.date);

            return (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        mb: 2, // Add margin below the chip
                      }}
                    >
                      <Chip
                        label={eventStatus}
                        color={
                          eventStatus === "Expired"
                            ? "error"
                            : eventStatus === "Current"
                            ? "primary"
                            : "success"
                        }
                        sx={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {formatDate(event.date)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 2 }}
                    >
                      Venue: {event.venue}
                    </Typography>
                    {event.logoUrl ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <img
                        src={event.logoUrl}
                        alt="Event Logo"
                        style={{ maxWidth: 200, height: 100, objectFit: "contain" }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No logo available
                    </Typography>
                  )}
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/registrations/event/${event._id}`)
                      }
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenModal(event)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleOpenConfirmation(() => handleDelete(event._id))
                      }
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenShareDialog(event)}
                    >
                      <Share />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <EventModal
        open={modalOpen}
        onClose={handleCloseModal}
        event={currentEvent}
        fetchEvents={fetchEvents}
      />

      <ShareEventDialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        event={currentEvent}
      />

      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmationAction}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </Box>
  );
};

export default ManageEvents;
