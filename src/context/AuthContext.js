"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Ensure user data has proper structure
        setUser(normalizeUserData(userData));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Normalize user data from API response
  const normalizeUserData = (userData) => {
    // If userData is from API response with data property
    if (userData.data) {
      const normalized = {
        ...userData.data,
        // Ensure role field exists - use userType if role doesn't exist
        role: userData.data.role || userData.data.userType || "user"
      };
      return normalized;
    }

    // If userData is direct user object
    return {
      ...userData,
      // Ensure role field exists
      role: userData.role || userData.userType || "user"
    };
  };

  const login = (userData) => {
    const normalizedUser = normalizeUserData(userData);
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    // Also store token if available in response
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Update user data (for profile updates etc.)
  const updateUser = (updatedData) => {
    const updatedUser = {
      ...user,
      ...updatedData,
      // Ensure role is preserved
      role: updatedData.role || user.role || updatedData.userType || user.userType || "user"
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);