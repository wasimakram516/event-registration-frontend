import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Admin/Login";
import Register from "../pages/Admin/Register";
import Dashboard from "../pages/Admin/Dashboard";
import SuperAdminDashboard from "../pages/Admin/SuperAdminDashboard";
import CreateEvent from "../pages/Admin/CreateEvent";
import EventDetails from "../pages/User/EventDetails";
import Registration from "../pages/User/Registration";
import Confirmation from "../pages/User/Confirmation";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../utils/ProtectedRoute";
import ManageEvents from "../pages/Admin/ManageEvents";
import ViewRegistrations from "../pages/Admin/ViewRegistrations";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
    <Route path="/superadmindashboard" element={<ProtectedRoute element={<SuperAdminDashboard />} />} />
    <Route path="/create-event" element={<ProtectedRoute element={<CreateEvent />} />} />
    <Route path="/events" element={<ProtectedRoute element={<ManageEvents />} />} />
    <Route path="/registrations/event/:eventId" element={<ProtectedRoute element={<ViewRegistrations />} />} />
    <Route path="/event/:eventId" element={<EventDetails />} />
    <Route path="/register/:eventId" element={<Registration />} />
    <Route path="/confirmation/:eventId" element={<Confirmation />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
