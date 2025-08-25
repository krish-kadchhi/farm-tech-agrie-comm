// farm-tech/frontend/src/components/fixLayouUsert.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import axios from "axios";

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");

  useEffect(() => {
    let timeoutId;
    const checkRole = async () => {
      try {
        const res = await axios.get("https://farm-tech-agrie-comm.onrender.com/auth/profile", { withCredentials: true });
        setUserRole(res?.data?.user?.role || "Customer");
      } catch (e) {
        setUserRole("Customer");
      } finally {
        timeoutId = setTimeout(checkRole, 3000);
      }
    };
    checkRole();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {userRole === "Admin" ? <AdminNavbar /> : <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
