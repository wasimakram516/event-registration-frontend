import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "./context/SnackbarProvider";
import AuthProvider from "./context/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <Navbar />
        <CssBaseline />
        <AppRoutes />

        <Footer />
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default App;
