import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //   const API_END_URL = process.env.REACT_APP_API_END_URL;
  const API_END_URL = "http://localhost:8222/api/auth";

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowOtpField(false);
      setIsTimerRunning(false);
      setErrorMessage("OTP expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerMessage("");
    try {
      
      const response = await fetch(
        `http://localhost:8222/api/auth/get-user/${email}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const response = await fetch(`${API_END_URL}/send-otp?email=${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          console.log(response);
          const data = await response.json();
          console.log(data);
          if (response.ok) {
            setShowOtpField(true);
            setTimer(300);
            setIsTimerRunning(true);
            setServerMessage(data.message);
            setErrorMessage("");
          } else {
            setErrorMessage(data.message);
          }
        } catch (error) {
          setErrorMessage("Failed to send OTP. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
    }
    else{
      setErrorMessage("email doesn't exist");
    }
    }  
    catch (error) {
      console.error("Error fetching employee email", error);
    }
  };

    
  

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(
        `${API_END_URL}/validate-otp?email=${email}&otp=${otp}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setShowOtpField(false);
        setShowPasswordFields(true);
        setIsTimerRunning(false);
        setServerMessage(data.message);
        setErrorMessage("");
      } else {
        setErrorMessage(data);
      }
    } catch (error) {
      setErrorMessage("Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setServerMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(
        `${API_END_URL}/reset-password?email=${email}&newPassword=${newPassword}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setServerMessage(data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center pt-16">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Reset Password
          </h2>

          {errorMessage && (
            <p className="text-red-600 text-center p-2 mb-4 rounded-md bg-red-100">
              {errorMessage}
            </p>
          )}

          {serverMessage && (
            <p className="text-green-600 text-center p-2 mb-4 rounded-md bg-green-100">
              {serverMessage}
            </p>
          )}

          {!showOtpField && !showPasswordFields && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-sky-800 text-white p-3 rounded-md transition duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed blur-sm"
                    : "hover:bg-sky-900"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {showOtpField && (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Time remaining: {formatTime(timer)}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-sky-800 text-white p-3 rounded-md transition duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed blur-sm"
                    : "hover:bg-sky-900"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Verifying OTP...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}

          {showPasswordFields && (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-sky-800 text-white p-3 rounded-md transition duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed blur-sm"
                    : "hover:bg-sky-900"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
