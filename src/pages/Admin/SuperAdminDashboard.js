import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import apiClient from "../../api/apiClient";
import { useSnackbar } from "../../context/SnackbarProvider";
import EditAdminDialog from "../../components/EditAdminDialog";
import EditRegistrationDialog from "../../components/EditRegistrationDialog";
import EventModal from "../../components/EventModal";
import ConfirmationDialog from "../../components/ConfirmationDialog";

// CardComponent for reusable card UI
const CardComponent = ({
    title,
    subtext,
    data,
    onRowClick,
    onEdit,
    onDelete,
    loading,
    selectedRowId,
  }) => (
    <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {subtext} ({data.length})
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <React.Fragment key={item._id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                    height:"60px",
                  py: 1,
                  px: 2,
                  cursor: "pointer",
                  bgcolor:
                    selectedRowId === item._id ? "action.selected" : "inherit",
                  "&:hover": {
                    bgcolor: "action.hover",
                    ".hover-icons": { display: "flex" }, // Show icons on hover
                  },
                }}
                onClick={() => onRowClick && onRowClick(item)}
              >
                <Typography>
                  {item.username ||
                    item.name ||
                    `${item.firstName} ${item.lastName}`}
                </Typography>
                <Box
                  className="hover-icons"
                  sx={{
                    display: "none", // Hidden by default
                    alignItems: "center",
                    gap: 1, // Add spacing between icons
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    sx={{ color: "primary.main" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item._id);
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              {index < data.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No records available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
  
const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editDialog, setEditDialog] = useState({
    open: false,
    type: "",
    data: null,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: () => {},
  });
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      try {
        const response = await apiClient.get("/superadmin/admins");
        setAdmins(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch admins.";
        showSnackbar(errorMessage, "error");
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdmins();
  }, [showSnackbar]);

  const handleAdminClick = async (admin) => {
    setSelectedAdminId(admin._id);
    setLoadingEvents(true);
    setEvents([]);
    try {
      const response = await apiClient.get(
        `/superadmin/admins/${admin._id}/events`
      );
      setEvents(response.data);
      setRegistrations([]);
      setSelectedEventId(null);
    } catch (err) {
      showSnackbar("Failed to fetch events.", "error");
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleEventClick = async (event) => {
    setSelectedEventId(event._id);
    setLoadingRegistrations(true);
    setRegistrations([]);
    try {
      const response = await apiClient.get(
        `/superadmin/events/${event._id}/registrations`
      );
      setRegistrations(response.data);
    } catch (err) {
      showSnackbar("Failed to fetch registrations.", "error");
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleEdit = (item, type) => {
    if (type === "event") {
      setSelectedEvent(item);
      setModalOpen(true);
    } else {
      setEditDialog({ open: true, type, data: item });
    }
  };

  const handleSave = async (updatedData) => {
    try {
      const { type, data } = editDialog;
      let url = "";

      switch (type) {
        case "admin":
          url = `/superadmin/admins/${data._id}`;
          break;
        case "registration":
          url = `/superadmin/registrations/${data._id}`;
          break;
        default:
          throw new Error("Invalid type");
      }

      await apiClient.put(url, updatedData);
      showSnackbar(`${type} updated successfully.`, "success");

      if (type === "admin") {
        setAdmins((prev) =>
          prev.map((item) => (item._id === data._id ? updatedData : item))
        );
      } else if (type === "registration") {
        setRegistrations((prev) =>
          prev.map((item) => (item._id === data._id ? updatedData : item))
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to save the changes.";
      showSnackbar(errorMessage, "error");
    } finally {
      setEditDialog({ open: false, type: "", data: null });
    }
  };

  const handleEventModalClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDelete = (id, type) => {
    setConfirmDialog({
      open: true,
      onConfirm: async () => {
        try {
          let url = "";

          switch (type) {
            case "admin":
              url = `/superadmin/admins/${id}`;
              break;
            case "event":
              url = `/superadmin/events/${id}`;
              break;
            case "registration":
              url = `/superadmin/registrations/${id}`;
              break;
            default:
              throw new Error("Invalid type");
          }

          await apiClient.delete(url);
          showSnackbar(`${type} deleted successfully.`, "success");

          if (type === "admin") {
            setAdmins((prev) => prev.filter((item) => item._id !== id));
          } else if (type === "event") {
            setEvents((prev) => prev.filter((item) => item._id !== id));
          } else if (type === "registration") {
            setRegistrations((prev) =>
              prev.filter((item) => item._id !== id)
            );
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || "Failed to delete the item.";
          showSnackbar(errorMessage, "error");
        } finally {
          setConfirmDialog({ open: false, onConfirm: () => {} });
        }
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Typography variant="h4"
        sx={{
          mb: 1,
          textAlign: "center",
          fontWeight: "bold",
        }}>
        Super Admin Dashboard
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Manage administrators, events, and registrations efficiently from one
        unified dashboard.
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <CardComponent
            title="Admins"
            subtext="Manage Administrators"
            data={admins}
            loading={loadingAdmins}
            selectedRowId={selectedAdminId}
            onRowClick={handleAdminClick}
            onEdit={(item) => handleEdit(item, "admin")}
            onDelete={(id) => handleDelete(id, "admin")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CardComponent
            title="Events"
            subtext="Oversee and update all Events"
            data={events}
            loading={loadingEvents}
            selectedRowId={selectedEventId}
            onRowClick={handleEventClick}
            onEdit={(item) => handleEdit(item, "event")}
            onDelete={(id) => handleDelete(id, "event")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CardComponent
            title="Registrations"
            subtext="Review and manage Event Registrations"
            data={registrations}
            loading={loadingRegistrations}
            onEdit={(item) => handleEdit(item, "registration")}
            onDelete={(id) => handleDelete(id, "registration")}
          />
        </Grid>
      </Grid>
      {editDialog.type === "admin" && (
        <EditAdminDialog
          open={editDialog.open}
          data={editDialog.data}
          onClose={() => setEditDialog({ open: false, type: "", data: null })}
          onSave={handleSave}
        />
      )}
      {editDialog.type === "registration" && (
        <EditRegistrationDialog
          open={editDialog.open}
          data={editDialog.data}
          onClose={() => setEditDialog({ open: false, type: "", data: null })}
          onSave={handleSave}
        />
      )}
      <EventModal
        open={modalOpen}
        onClose={handleEventModalClose}
        event={selectedEvent}
        fetchEvents={() => {}}
        useSuperAdmin={true}
      />
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: () => {} })}
        onConfirm={confirmDialog.onConfirm}
      />
    </Box>
  );
};

export default SuperAdminDashboard;
