// farm-tech/frontend/src/components/fixLayoutUser.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode"; // Correct import

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

    checkUserRole(); // Check role once when component mounts
  }, []);

  return (
    <>
      {userRole === "Admin" ? <AdminNavbar /> : <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
