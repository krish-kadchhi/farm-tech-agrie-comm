import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";


function verifyOtp() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [userData, setUserData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
            const token = Cookies.get("loginCookie");
            if (token) {
                const decoded = jwtDecode(token);
                console.log("decoded token", decoded);
                setUserData(decoded);
            }else {
                // navigate("/signup");
            }
        }, [ navigate ]);
  
    const handleVerify = async () => {
      try {
        const userId = userData._id;
        console.log("User ID:", userId);
        const response = await axios.post(
          "http://localhost:8080/auth/verifyOtp",
          { userId, otp }, // ✅ Ensure userId is sent
          { headers: { "Content-Type": "application/json" } }
        );
  
        if (response.data.success) {
          navigate("/products");
        } else {
          setError(response.data.message || "Invalid OTP");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error verifying OTP.");
        console.error("Verify OTP error:", error.response?.data || error);
      }
    };
  
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ padding: "10px", margin: "10px", fontSize: "16px" }}
        />
        <button onClick={handleVerify} style={{ padding: "10px", fontSize: "16px" }}>
          Verify OTP
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
}

export default verifyOtp
