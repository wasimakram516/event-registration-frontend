import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, ErrorOutline,AccountCircle } from "@mui/icons-material";
import apiClient from "../../api/apiClient";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

// Auto-hide success or error messages
useEffect(() => {
  if (success || error || passwordError) {
    const timer = setTimeout(() => {
      setSuccess(false);
      setError(null);
      setPasswordError("");
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [success, error, passwordError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordRules({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    return Object.values(passwordRules).every((rule) => rule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!validatePassword(formData.password)) {
      setPasswordError("Password does not meet the required criteria.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/admin/register", {
        username: formData.username,
        password: formData.password,
      });
      setSuccess(true);
      setFormData({ username: "", password: "", confirmPassword: "" });
      setPasswordRules({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <AccountCircle sx={{ fontSize: 40, color: "primary.main", mr: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Admin Register
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Registration successful! You can now log in.
            </Alert>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Register"
            )}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            underline="hover"
            sx={{
              fontWeight: "bold",
              color: "primary.main", // Use theme's primary color
              "&:hover": {
                color: "secondary.main", // Change color on hover for emphasis
              },
              textDecoration: "none", // Remove underline for a cleaner look
            }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
