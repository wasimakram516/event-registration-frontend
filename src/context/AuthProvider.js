import React, { createContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/tokenUtils";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load the user from the token on initial render
  useEffect(() => {
    const tokenUser = decodeToken();
    if (tokenUser) {
      setUser(tokenUser);
    }
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
