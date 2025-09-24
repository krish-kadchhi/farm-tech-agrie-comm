import React, { useState, useEffect } from "react";
import Navbar from "./navbarUser";
import AdminNavbar from "./navbarAdmin";
import Cookies from "js-cookie";
import * as jwtDecode from "jwt-decode"; // Works with Rollup/Vite

const LayoutUser = ({ children }) => {
  const [userRole, setUserRole] = useState("Customer");

  useEffect(() => {
    const checkUserRole = () => {
      const token = Cookies.get("loginCookie");
      if (token) {
        try {
          const decoded = jwtDecode.default(token); // note `.default` with `* as jwtDecode`
          setUserRole(decoded.role || "Customer");
        } catch {
          Cookies.remove("loginCookie");
          setUserRole("Customer");
        }
      } else {
        setUserRole("Customer");
      }
    };
    checkUserRole();
  }, []);

  return (
    <>
      {userRole === "Admin" ? <AdminNavbar /> : <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default LayoutUser;
