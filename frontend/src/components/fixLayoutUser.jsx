import React, { useState, useEffect } from "react";
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LayoutUser = ({ Children }) => {
  const [role, setRole] = useState("Customer"); // Default role is "user"

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setRole(decoded.role); // Update the role based on the decoded token
      } catch (error) {
        console.error("Invalid token", error);
        // Handle invalid token (e.g., clear the token and redirect to login)
        Cookies.remove("token");
        setRole("Customer"); // Fallback to default role if token is invalid
      }
    }
    // If no token is found, the role remains "user" by default
  }, []);

  return (
    <>
      {/* Conditionally render the appropriate navbar */}
      {role === "Admin" ? <AdminNavbar /> : <Navbar />}
      <main>{Children}</main>
    </>
  );
};

export default LayoutUser;