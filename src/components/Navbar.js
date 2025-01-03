import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import ConfirmationDialog from "../components/ConfirmationDialog";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleMenuClose();
  };

  const handleLogoutConfirm = () => {
    logout(); // Call the logout function from AuthContext
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "secondary.main", color: "white", height: "60px", }}>
        <Toolbar>
          {/* Logo / Title */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: "Comfortaa",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            EventCloud
          </Typography>
          <Box>
            {user ? (
              <>
                {/* Username with Dropdown Icon */}
                <Button
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    mx: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={handleMenuOpen}
                >
                  <strong style={{ marginLeft: "5px" }}>{user.username}</strong>
                  <ArrowDownIcon/>
                </Button>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ textTransform: "none", mx: 1 }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Navbar;
