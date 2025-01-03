import React, { useContext } from "react";
import { Box, Typography, Button, Paper, Link, Divider } from "@mui/material";
import { AccountCircle, Dashboard, Event, Link as LinkIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (user?.role === "admin") {
      navigate("/dashboard");
    } else if (user?.role === "superadmin") {
      navigate("/superadmindashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        p: 3,
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Welcome Section */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          background: "linear-gradient(90deg, #007BFF, #00C6FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
        }}
      >
        Welcome to EventCloud
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "text.primary", mb: 4 }}
      >
        An event management platform powered by{" "}
        <Link
          href="https://www.whitewall.om/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "inherit", fontWeight: "bold" }}
        >
          WhiteWall Digital Solutions
        </Link>
        . <br />
        Create your account today to manage events seamlessly and professionally.
      </Typography>

      {/* Single Elevated Card */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "800px",
          borderRadius: 3,
          textAlign: "left",
        }}
      >
        {[
          {
            icon: <AccountCircle sx={{ fontSize: 40, color: "primary.main" }} />,
            title: "Register as an Admin",
            description: "Sign up to create and manage your events effortlessly.",
          },
          {
            icon: <Dashboard sx={{ fontSize: 40, color: "primary.main" }} />,
            title: "Log in to the Dashboard",
            description:
              "Access your personalized dashboard to organize events and track registrations.",
          },
          {
            icon: <Event sx={{ fontSize: 40, color: "primary.main" }} />,
            title: "Create an Event",
            description:
              "Add event details to generate a unique registration link in minutes.",
          },
          {
            icon: <LinkIcon sx={{ fontSize: 40, color: "primary.main" }} />,
            title: "Share the Registration Link",
            description:
              "Distribute the link through social media, email, or your website for attendees.",
          },
        ].map((step, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "flex-start", mb: index < 3 ? 3 : 0 }}
          >
            {step.icon}
            <Box ml={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {step.title}
              </Typography>
              <Typography>{step.description}</Typography>
            </Box>
            {index < 3 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Paper>

      {/* Call to Action */}
      <Button
        onClick={handleNavigation}
        variant="contained"
        color="primary"
        size="large"
        sx={{
          mt: 5,
          px: 4,
          py: 1.5,
          fontWeight: "bold",
          borderRadius: 5,
        }}
      >
        {user ? "GO TO DASHBOARD" : "Sign In"}
      </Button>
    </Box>
  );
};

export default Home;
