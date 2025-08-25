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
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const newRole = decoded.role || "Customer";
        if (newRole !== userRole) {
          setUserRole(newRole);
        }
      } catch (error) {
        console.error("Invalid token", error);
        Cookies.remove("loginCookie");
        setUserRole("Customer");
      }
    } else {
      if (userRole !== "Customer") {
        setUserRole("Customer");
      }
    }
  };

  useEffect(() => {
    // Check role when component mounts
    checkUserRole();

    // Set up an interval to check the token periodically
    const intervalId = setInterval(checkUserRole, 2000);

    // Listen for login/logout events
    const handleAuthChange = () => {
      checkUserRole();
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
  }, [userRole]); // Add userRole to dependency array

  return (
    <>
      {userRole === "Admin" ? <AdminNavbar /> : <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
