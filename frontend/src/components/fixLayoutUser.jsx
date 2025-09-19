import React, { useState, useEffect } from "react";
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");
  
  useEffect(() => {
    const checkUserRole = () => {
      try {
        // Try to get token from js-cookie first
        let token = Cookies.get("loginCookie");
        
        // If js-cookie fails, try reading from document.cookie directly
        if (!token) {
          const cookies = document.cookie.split(';');
          const loginCookie = cookies.find(cookie => 
            cookie.trim().startsWith('loginCookie=')
          );
          if (loginCookie) {
            token = loginCookie.split('=')[1];
          }
        }
        
        if (!token) {
          console.log("No login cookie found, setting role to Customer");
          setUserRole("Customer");
          return;
        }
        
        const decoded = jwtDecode(token);
        const roleFromToken = decoded?.role || "Customer";
        console.log("User role from token:", roleFromToken);
        setUserRole(roleFromToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole("Customer");
      }
    };

    // Check role on component mount
    checkUserRole();
  }, []);

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
