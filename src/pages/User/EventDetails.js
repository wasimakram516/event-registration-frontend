import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material"; // Import time icon
import apiClient from "../../api/apiClient";
import NotFound from "../NotFound";
import { formatDate } from "../../utils/dateUtils";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        if (err.response?.status === 400 || err.response?.status === 404) {
          setError(err.response?.data?.message || "Event not found.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);

    if (
      eventDateObj < today &&
      today.toDateString() !== eventDateObj.toDateString()
    ) {
      return "Expired";
    } else if (today.toDateString() === eventDateObj.toDateString()) {
      return "Current";
    } else {
      return "Upcoming";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <NotFound message={error} />;
  }

  const eventStatus = getEventStatus(event.date);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          maxWidth: "700px",
          textAlign: "center",
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "20px",
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
        {event.logoUrl && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={event.logoUrl}
              alt={`${event.name} Logo`}
              style={{ maxHeight: "100px", objectFit: "contain" }}
            />
          </Box>
        )}
        <Typography
          variant="h5"
          sx={{
            marginBottom: "10px",
            fontWeight: "bold",
            fontFamily: "'Comfortaa', cursive",
          }}
        >
          Welcome to {event.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: "10px",
            fontSize: "18px",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {event.venue} | {formatDate(event.date)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: "30px",
            fontSize: "16px",
            color: "#555",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Thank you for joining us—please register below to secure your place.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            fontSize: "16px",
            padding: "10px 30px",
            textTransform: "none",
            borderRadius: "8px",
          }}
          onClick={() => navigate(`/register/${eventId}`)}
          disabled={eventStatus === "Expired"}
        >
          Register Now
        </Button>
        <Stack
          direction="row"
          spacing={1}
          sx={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent:"center" }}
        >
          <AccessTime fontSize="small" />
          <Typography variant="caption">Takes 15 sec</Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EventDetails;
