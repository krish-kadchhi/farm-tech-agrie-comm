import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        console.log("Fetching user role from backend...");
        
        const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
          withCredentials: true
        });
        
        if (response.data.success && response.data.user) {
          const roleFromServer = response.data.user.role || "Customer";
          console.log("Role from backend:", roleFromServer);
          console.log("Is Admin?", roleFromServer === "Admin");
          setUserRole(roleFromServer);
        } else {
          console.log("No valid user data from backend, setting role to Customer");
          setUserRole("Customer");
        }
      } catch (error) {
        console.error("Error fetching user role from backend:", error);
        console.log("Setting role to Customer due to error");
        setUserRole("Customer");
      } finally {
        setLoading(false);
      }
    };

    // Check role on component mount
    checkUserRole();
  }, []);

  console.log("Rendering with userRole:", userRole);
  console.log("Will render AdminNavbar?", userRole === "Admin");
  
  // Show loading state while fetching user role
  if (loading) {
    return (
      <>
        <Navbar /> {/* Default to regular navbar while loading */}
        <main>{children}</main>
      </>
    );
  }
  
  return (
    <>
      {userRole === "Admin" ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
