import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import apiClient from "../../api/apiClient";

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
        setError(err.response?.data?.message || "Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}
      {event && (
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            maxWidth:"60%",
            minHeight: "calc(100vh - 120px)", 
            textAlign: "center",
            alignContent:"center",
            justifyContent:"center",
            width: "100%",
            borderRadius: "12px",
          }}
        >
          {event.logoUrl && (
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
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
              marginBottom: "20px",
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
          >
            Register Now
          </Button>
          <Typography variant="caption" sx={{ marginTop: "10px", display: "block" }}>
            Takes 15 sec
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default EventDetails;
