import React, { useContext } from "react";
import { Box, Typography, Button, Stack, Paper, Link } from "@mui/material";
import { AccountCircle, Dashboard, Event, Link as LinkIcon } from "@mui/icons-material";
import { AuthContext } from "../context/AuthProvider";
import WhiteWallLogo from "../assets/WWDS Logo.png";

const Home = () => {
  const { user } = useContext(AuthContext); // Access user from AuthContext

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* WhiteWall Logo */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={WhiteWallLogo}
          alt="WhiteWall Digital Solutions"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Box>

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
      <Typography variant="h6" gutterBottom sx={{ color: "text.secondary", mb: 4 }}>
        An event management platform powered by{" "}
        <Link
          href="https://www.whitewall.om/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: "inherit", fontWeight: "bold" }}
        >
          WhiteWall Digital Solutions
        </Link>
        . <br />
        Create your account today to manage events seamlessly and professionally.
      </Typography>

      {/* Instructions Section */}
      <Stack spacing={3} mt={4} maxWidth="600px">
        {[
          {
            icon: <AccountCircle color="primary" />,
            title: "Register as an Admin",
            description: "Sign up to create and manage your events effortlessly.",
          },
          {
            icon: <Dashboard color="primary" />,
            title: "Log in to the Dashboard",
            description: "Access your personalized dashboard to organize events and track registrations.",
          },
          {
            icon: <Event color="primary" />,
            title: "Create an Event",
            description: "Add event details to generate a unique registration link in minutes.",
          },
          {
            icon: <LinkIcon color="primary" />,
            title: "Share the Registration Link",
            description: "Distribute the link through social media, email, or your website for attendees.",
          },
        ].map((step, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
            }}
          >
            {step.icon}
            <Box ml={2}>
              <Typography variant="h6" gutterBottom>
                {`${index + 1}. ${step.title}`}
              </Typography>
              <Typography>{step.description}</Typography>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Call to Action */}
      <Button
        component={Link}
        href={user ? "/dashboard" : "/login"}
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
        {user ? "RETURN TO DASHBOARD" : "LOGIN / REGISTER"}
      </Button>
    </Box>
  );
};

export default Home;
