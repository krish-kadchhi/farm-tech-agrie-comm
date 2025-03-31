// farm-tech/frontend/src/components/fixLayouUsert.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");

  useEffect(() => {
    const checkUserRole = () => {
      const token = Cookies.get("loginCookie");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role || "Customer");
        } catch (error) {
          console.error("Invalid token", error);
          Cookies.remove("loginCookie");
          setUserRole("Customer");
        }
      } else {
        setUserRole("Customer");
      }
    };

    // Check role when component mounts
    checkUserRole();

    // Set up an interval to check the token periodically
    const intervalId = setInterval(checkUserRole, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Add navigate to the dependency array

  return (
    <>
      {userRole === "Admin" ? <AdminNavbar /> : <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
