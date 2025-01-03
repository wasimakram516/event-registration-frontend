import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Login as LoginIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { setAccessToken, setRefreshToken } from "../../utils/tokenService";
import { decodeToken } from "../../utils/tokenUtils";
import { AuthContext } from "../../context/AuthProvider";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/admin/login", formData);
      const { accessToken, refreshToken } = response.data;

      // Store tokens in token service
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // Decode the token to get user details
      const decodedToken = decodeToken();
      if (!decodedToken) {
        setError("Failed to decode token. Please try again.");
        return;
      }

      const { username, role } = decodedToken;
      const user = { username, role };

      login(user); // Update context with the logged-in user

      // Redirect based on role
      if (role === "superadmin") {
        navigate("/superadmindashboard");
      } else if (role === "admin") {
        navigate("/dashboard");
      } else {
        setError("Unknown role, please contact support.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials.");
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
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Admin Login
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
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={<LoginIcon />}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center", fontSize: "16px" }}>
          Don't have an account?{" "}
          <Link
            href="/register"
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
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
