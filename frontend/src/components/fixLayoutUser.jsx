// farm-tech/frontend/src/components/fixLayouUsert.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");

  const checkUserRole = () => {
    const token = Cookies.get("loginCookie");
    console.log("Checking role - Token found:", !!token); // Debug log
    
    // Also check document.cookie as backup
    const allCookies = document.cookie;
    console.log("All cookies:", allCookies); // Debug log
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const newRole = decoded.role || "Customer";
        console.log("Token decoded - Role:", newRole, "Full decoded:", decoded); // Debug log
        console.log("Current role:", userRole, "New role:", newRole); // Debug log
        if (newRole !== userRole) {
          console.log("Role changed from", userRole, "to", newRole); // Debug log
          setUserRole(newRole);
        }
      } catch (error) {
        console.error("Invalid token", error);
        Cookies.remove("loginCookie");
        setUserRole("Customer");
      }
    } else {
      if (userRole !== "Customer") {
        console.log("No token found, setting role to Customer"); // Debug log
        setUserRole("Customer");
      }
    }
  };

  useEffect(() => {
    // Check role when component mounts
    checkUserRole();

    // Set up an interval to check the token periodically (faster for better responsiveness)
    const intervalId = setInterval(checkUserRole, 500);

    // Listen for login/logout events
    const handleAuthChange = () => {
      console.log("Auth change event detected, checking role..."); // Debug log
      // Force immediate role check multiple times to ensure detection
      checkUserRole();
      setTimeout(() => {
        checkUserRole();
      }, 50);
      setTimeout(() => {
        checkUserRole();
      }, 200);
      setTimeout(() => {
        checkUserRole();
      }, 500);
    };

    // Listen for profile updates and other auth-related events
    window.addEventListener('profileUpdated', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChanged', handleAuthChange);

    // Clean up interval and event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('profileUpdated', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []); // Remove userRole from dependency array to prevent infinite loops

  // Debug log for role changes
  useEffect(() => {
    console.log("Role state changed to:", userRole);
    // Force a re-render when role changes
    if (userRole === "Admin") {
      console.log("Admin role detected, should show AdminNavbar");
    } else {
      console.log("Non-admin role detected, should show Navbar");
    }
  }, [userRole]);

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
