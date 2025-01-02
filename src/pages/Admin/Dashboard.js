import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Dashboard = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsResponse, registrationsResponse] = await Promise.all([
          apiClient.get("/events/count/event"),
          apiClient.get("/registrations/count"),
        ]);

        setTotalEvents(eventsResponse.data.totalEvents);
        setTotalRegistrations(registrationsResponse.data.totalRegistrations);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Admin Dashboard
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        View your event and registration statistics, manage events, and get an overview of your platform activity.
      </Typography>

      <Grid container spacing={4}>
        {/* Manage Events */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 200,
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Manage Events
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create, manage, and view details of your events.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mx: "auto", mb: 2 }}
                onClick={() => navigate("/events")}
              >
                Manage Events
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {/* Total Events */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 200,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Total Events
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center", mb: 2 }}
              >
                Total number of events created and managed by you.
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                {totalEvents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Registrations */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 200,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Total Registrations
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center", mb: 2 }}
              >
                Total number of attendees registered across all your events.
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                {totalRegistrations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
