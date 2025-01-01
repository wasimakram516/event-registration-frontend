import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\+?[0-9]*$/.test(value)) return; // Restrict input to + and numbers

    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const isValidEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      setError("Please fill all the required fields.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/registrations", { ...formData, eventId });
      navigate(`/confirmation/${eventId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          maxWidth: "600px",
          width: "100%",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            fontFamily: "'Comfortaa', cursive",
            fontWeight: "bold",
          }}
        >
          Register for the Event
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          name="phone"
          label="Phone Number (with country code)"
          value={formData.phone}
          onChange={handleInputChange}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          error={formData.email && !isValidEmail(formData.email)} // Show error state
          helperText={
            formData.email && !isValidEmail(formData.email)
              ? "Invalid email format"
              : ""
          } // Helper text for invalid email
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          name="company"
          label="Company (Optional)"
          value={formData.company}
          onChange={handleInputChange}
          sx={{ marginBottom: "20px" }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            fontSize: "16px",
            padding: "10px 20px",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Registration;
