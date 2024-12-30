import React from "react";
import { Box, Typography, Link } from "@mui/material";
import WhiteWallLogo from "../assets/WWDS Logo white.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "secondary.main",
        color: "white",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: "Montserrat",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 1, // Adds spacing between the text and logo
        }}
      >
        Powered by{" "}
        <Link
          href="https://www.whitewall.om/"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ color: "inherit", display: "flex", alignItems: "center" }}
        >
          <img
            src={WhiteWallLogo}
            alt="WhiteWall Digital Solutions"
            style={{ maxWidth: "180px", height: "auto" }} // Adjusted size for alignment
          />
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
