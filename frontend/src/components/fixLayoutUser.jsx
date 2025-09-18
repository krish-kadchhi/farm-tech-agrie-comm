// farm-tech/frontend/src/components/fixLayouUsert.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import API_BASE_URL, { API_ENDPOINTS } from "../config/api";
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");
  const navigate = useNavigate();
  const checkUserRole = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.AUTH.PROFILE, { withCredentials: true });
      const roleFromServer = res?.data?.user?.role || "Customer";
      if (roleFromServer !== userRole) setUserRole(roleFromServer);
    } catch (err) {
      // Not logged in; ensure role is Customer and optionally route stays
      if (userRole !== "Customer") setUserRole("Customer");
    }
  };

  useEffect(() => {
    // Initial role fetch
    checkUserRole();

    // Listen for login/logout/profile updates
    const handleAuthChange = () => {
      checkUserRole();
    };

    // Listen for profile updates and other auth-related events
    window.addEventListener('profileUpdated', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChanged', handleAuthChange);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('profileUpdated', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []); // Remove userRole from dependency array to prevent infinite loops

  // Optional: react to role changes if needed

  return (
    <>
      {userRole === "Admin" ? (
        <AdminNavbar key="admin-navbar" />
      ) : (
        <Navbar key="user-navbar" />
      )}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
