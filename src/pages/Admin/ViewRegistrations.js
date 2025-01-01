import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import { Delete, FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import NotFound from "../NotFound";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { formatDate } from "../../utils/dateUtils";

const ViewRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState(null);

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
        if (err.response?.status === 400 || err.response?.status === 404) {
          setError(err.response?.data?.message || "Event not found.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/registrations/${registrationToDelete}`);
      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationToDelete)
      );
      setRegistrationToDelete(null);
    } catch (err) {
      console.error("Failed to delete registration:", err);
    }
  };

  const exportToCSV = () => {
    if (!eventDetails) return;
  
    const csvHeaders = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Company",
    ];
  
    const csvRows = registrations.map((reg) => [
      reg.firstName || "N/A", // Default to "N/A" if missing
      reg.lastName || "N/A", // Default to "N/A" if missing
      reg.email || "N/A",
      reg.phone ? `="${reg.phone}"` : "N/A", // Use ="phone" to preserve format without a single quote
      reg.company || "N/A", // Default to "N/A" if missing
    ]);
  
    // Add event details at the beginning
    const eventMetadata = [
      ["Event Name:", eventDetails.name || "N/A"],
      ["Event Date:", formatDate(eventDetails.date || "N/A")],
      ["Venue:", eventDetails.venue || "N/A"],
      ["Description:", eventDetails.description || "N/A"],
      ["Logo URL:", eventDetails.logoUrl || "N/A"],
      [], // Empty row for spacing
    ];
  
    const csvContent = [
      ...eventMetadata.map((row) => row.join(",")), // Add event details as rows
      csvHeaders.join(","), // Add headers
      ...csvRows.map((row) => row.join(",")), // Add registration data
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${eventDetails.name || "event"}_registrations.csv`;
    link.click();
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

      {eventDetails && (
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
                style={{
                  maxHeight: 100,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {eventDetails.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 0.5 }}>
            <strong>Date:</strong> {formatDate(eventDetails.date)}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 0.5 }}>
            <strong>Venue:</strong> {eventDetails.venue}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <strong>Description:</strong>{" "}
            {eventDetails.description || "N/A"}
          </Typography>
        </Box>
      )}

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

      {registrations.length > 0 && (
        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={exportToCSV}
          color="primary"
          startIcon={<FileDownloadIcon />}
        >
          Export to CSV
        </Button>
      )}
      {registrations.length === 0 ? (
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
      ) : (
        <Grid container spacing={4}>
          {registrations.map((registration) => (
            <Grid item xs={12} sm={6} md={4} key={registration._id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  height: "100%",
                  position: "relative", // Required for absolute positioning
                }}
              >
                <IconButton
                  color="error"
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  onClick={() => {
                    setRegistrationToDelete(registration._id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Delete />
                </IconButton>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {registration.firstName} {registration.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Email:</strong> {registration.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Phone:</strong> {registration.phone}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Company:</strong>{" "}
                    {registration.company || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Registration"
        message="Are you sure you want to delete this registration? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default ViewRegistrations;
