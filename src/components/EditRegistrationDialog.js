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

const EditRegistrationDialog = ({ open, data, onClose, onSave, loading }) => {
  const [registrationDetails, setRegistrationDetails] = useState(data);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setRegistrationDetails(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationDetails((prev) => ({ ...prev, [name]: value }));

    // Clear the error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    // Validate first name
    if (!registrationDetails.firstName || registrationDetails.firstName.trim() === "") {
      newErrors.firstName = "First name is required.";
    }

    // Validate last name
    if (!registrationDetails.lastName || registrationDetails.lastName.trim() === "") {
      newErrors.lastName = "Last name is required.";
    }

    // Validate email
    if (
      !registrationDetails.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationDetails.email)
    ) {
      newErrors.email = "A valid email is required.";
    }

    // Validate phone
    if (
      !registrationDetails.phone ||
      !/^\+?[0-9]+$/.test(registrationDetails.phone)
    ) {
      newErrors.phone = "Phone number must only contain numbers and an optional '+' for the country code.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(registrationDetails);
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
        <Typography variant="h6">Edit Registration</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          name="firstName"
          value={registrationDetails?.firstName || ""}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          name="lastName"
          value={registrationDetails?.lastName || ""}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={registrationDetails?.email || ""}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone"
          name="phone"
          value={registrationDetails?.phone || ""}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Company"
          name="company"
          value={registrationDetails?.company || ""}
          onChange={handleChange}
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

export default EditRegistrationDialog;
