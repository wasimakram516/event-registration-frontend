import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

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
        <ErrorIcon
          sx={{
            fontSize: "80px",
            color: "red",
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
          404: Page Not Found
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
          Oops! The page you are looking for does not exist or has been moved.
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
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
