import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { CheckCircleOutline as CheckCircleIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get eventId from route params

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          maxWidth: "600px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: "150px",
            color: "green",
            marginBottom: "20px",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
            fontFamily: "'Comfortaa', cursive",
          }}
        >
          Registration Successful!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: "30px",
            fontSize: "16px",
            color: "#555",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Thank you for registering. We look forward to seeing you at the event!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            fontSize: "16px",
            padding: "10px 20px",
            textTransform: "none",
            borderRadius: "8px",
          }}
          onClick={() => navigate(`/event/${eventId}`)}
        >
          View Event Details
        </Button>
      </Paper>
    </Box>
  );
};

export default Confirmation;
