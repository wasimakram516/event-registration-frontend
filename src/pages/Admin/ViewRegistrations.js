import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";

const ViewRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventResponse = await apiClient.get(`/events/${eventId}`);
        setEventDetails(eventResponse.data);
  
        const registrationsResponse = await apiClient.get(
          `/registrations/event/${eventId}`
        );
        setRegistrations(registrationsResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [eventId]); // Only 'eventId' is a dependency.
  

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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Event Details
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      {!loading && eventDetails && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            mb: 3,
            p: 4,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          {eventDetails.logoUrl && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <img
                src={eventDetails.logoUrl}
                alt={`${eventDetails.name} Logo`}
                style={{ maxHeight: 100, maxWidth: "100%", objectFit: "contain" }}
              />
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {eventDetails.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 0.5 }}>
            <strong>Date:</strong>{" "}
            {new Date(eventDetails.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 0.5 }}>
            <strong>Venue:</strong> {eventDetails.venue}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <strong>Description:</strong> {eventDetails.description || "N/A"}
          </Typography>
        </Box>
      )}

      {!loading && (
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: "medium",
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          Total Registrations: {registrations.length}
        </Typography>
      )}

      {!loading && registrations.length === 0 && (
        <Typography
          sx={{
            mt: 2,
            fontSize: "1.2rem",
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          No registrations found for this event.
        </Typography>
      )}

      {!loading && registrations.length > 0 && (
        <Grid container spacing={4}>
          {registrations.map((registration, index) => (
            <Grid item xs={12} sm={6} md={4} key={registration._id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {registration.firstName} {registration.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Email:</strong> {registration.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    <strong>Phone:</strong> {registration.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    <strong>Company:</strong> {registration.company || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ViewRegistrations;
