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
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircle, ErrorOutline } from "@mui/icons-material";

const EditAdminDialog = ({ open, data, onClose, onSave, loading }) => {
  const [adminDetails, setAdminDetails] = useState(data);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    setAdminDetails(data);
  }, [data]);

  const validateUsername = (username) => {
    if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters long.");
      return false;
    }
    if (/\s/.test(username)) {
      setUsernameError("Username should not contain spaces.");
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameError("Username should only contain alphanumeric characters.");
      return false;
    }
    setUsernameError(""); // Clear error if valid
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      validateUsername(value);
    }

    if (name === "password") {
      const newPasswordRules = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      };
      setPasswordRules(newPasswordRules);

      // Show password rules if conditions are unmet
      if (!Object.values(newPasswordRules).every((rule) => rule)) {
        setShowPasswordRules(true);
      } else {
        // Hide rules once all conditions are met
        setShowPasswordRules(false);
      }
    }
  };

  const validatePassword = (password) => {
    return Object.values(passwordRules).every((rule) => rule);
  };

  const handleSave = () => {
    if (!validateUsername(adminDetails.username)) {
      return;
    }

    if (adminDetails.password && !validatePassword(adminDetails.password)) {
      setPasswordError("Password must meet all the criteria listed.");
      return;
    }

    setPasswordError(""); // Clear error if password is valid or not provided
    onSave(adminDetails);
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
        <Typography variant="h6">Edit Admin</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={adminDetails?.username || ""}
          onChange={handleChange}
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={adminDetails?.password || ""}
          onChange={handleChange}
          onFocus={() => setShowPasswordRules(true)}
          onBlur={() => {
            if (validatePassword(adminDetails.password)) {
              setShowPasswordRules(false);
            }
          }}
          error={!!passwordError}
          helperText={passwordError}
        />
        {showPasswordRules && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Password must include:</Typography>
            <List>
              {[
                { rule: "At least 8 characters", fulfilled: passwordRules.length },
                { rule: "An uppercase letter", fulfilled: passwordRules.uppercase },
                { rule: "A lowercase letter", fulfilled: passwordRules.lowercase },
                { rule: "A number", fulfilled: passwordRules.number },
                { rule: "A special character (@$!%*?&)", fulfilled: passwordRules.specialChar },
              ].map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    {item.fulfilled ? (
                      <CheckCircle color="success" />
                    ) : (
                      <ErrorOutline color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.rule}
                    sx={{ color: item.fulfilled ? "success.main" : "error.main" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAdminDialog;
