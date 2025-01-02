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
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, ErrorOutline, AccountCircle } from "@mui/icons-material";
import apiClient from "../../api/apiClient";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-hide success or error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const validateForm = () => {
    const errors = {};
    const { username, password, confirmPassword } = formData;

    // Username validation
    if (username.length < 4) {
      errors.username = "Username must be at least 4 characters long.";
    } else if (/\s/.test(username)) {
      errors.username = "Username should not contain spaces.";
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.username = "Username should only contain alphanumeric characters.";
    }

    // Password validation
    const newPasswordRules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordRules(newPasswordRules);

    if (!Object.values(newPasswordRules).every((rule) => rule)) {
      errors.password = "Password does not meet the required criteria.";
    }

    // Confirm Password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear specific field error when user starts typing
    setFormErrors({ ...formErrors, [name]: "" });
  
    // Dynamic validation for fields
    if (name === "username") {
      const usernameError =
        value.length < 4
          ? "Username must be at least 4 characters long."
          : /\s/.test(value)
          ? "Username should not contain spaces."
          : !/^[a-zA-Z0-9]+$/.test(value)
          ? "Username should only contain alphanumeric characters."
          : "";
      setFormErrors((prev) => ({ ...prev, username: usernameError }));
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
      setShowPasswordRules(!Object.values(newPasswordRules).every((rule) => rule));
  
      // Check for confirm password mismatch
      if (formData.confirmPassword && formData.confirmPassword !== value) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }
  
    if (name === "confirmPassword") {
      const confirmPasswordError =
        value !== formData.password
          ? "Passwords do not match."
          : "";
      setFormErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            error={!!formErrors.username}
            helperText={formErrors.username}
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
            error={!!formErrors.password}
            helperText={formErrors.password}
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
          {showPasswordRules && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Password must include:</Typography>
              <List>
                {[{
                  rule: "At least 8 characters",
                  fulfilled: passwordRules.length,
                }, {
                  rule: "An uppercase letter",
                  fulfilled: passwordRules.uppercase,
                }, {
                  rule: "A lowercase letter",
                  fulfilled: passwordRules.lowercase,
                }, {
                  rule: "A number",
                  fulfilled: passwordRules.number,
                }, {
                  rule: "A special character (@$!%*?&)",
                  fulfilled: passwordRules.specialChar,
                }].map((item, index) => (
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
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
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
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            underline="hover"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              "&:hover": {
                color: "secondary.main",
              },
              textDecoration: "none",
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
