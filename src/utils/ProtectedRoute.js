import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken } from "../utils/tokenService";
import apiClient from "../api/apiClient";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken) {
        setIsAuthenticated(true);
      } else if (refreshToken) {
        try {
          const { data } = await apiClient.post("/admin/refresh", { refreshToken });
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
        } catch {
          removeAccessToken();
          removeRefreshToken();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
