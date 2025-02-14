import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("loginCookie");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded Token:", decoded);
                setUserData(decoded);
            } catch (error) {
                console.error("Error decoding token:", error);
                setError("Invalid session, please sign in again.");
            }
        } else {
            setError("No token found, please sign in.");
        }
    }, []);

    const handleVerify = async () => {
        if (!userData || !userData.userId) {
            setError("User data not loaded, please refresh and try again.");
            return;
        }

        try {
            console.log("Sending User ID:", userData.userId);
            const response = await axios.post(
                "http://localhost:8080/auth/verifyOtp",
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
