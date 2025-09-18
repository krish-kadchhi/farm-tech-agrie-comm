import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL, { API_ENDPOINTS } from "../config/api";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // userId is sent back in OTP response path; we don't rely on cookie here
    }, []);

    const handleVerify = async () => {
        if (!userData || !userData.userId) {
            setError("User data not loaded, please refresh and try again.");
            return;
        }

        try {
            console.log("Sending User ID:", userData.userId);
            const response = await axios.post(
                `${API_BASE_URL}/auth/verifyOtp`,
                { userId: userData.userId, otp },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Verify OTP Response:", response.data);

            if (response.data.success) {
                navigate("/products");
            } else {
                setError(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error verifying OTP.");
            console.error("Verify OTP Error:", error.response?.data || error);
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

export default VerifyOtp;
