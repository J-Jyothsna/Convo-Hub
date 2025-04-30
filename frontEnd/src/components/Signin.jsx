import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function SignIn() {
  const API_END_POINT = "http://localhost:8222/api/auth";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch(API_END_POINT + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("email", formData.email);
        setIsLoggedIn(true);

        // Add 2 second timeout before navigation
        setTimeout(() => {
          navigate("/welcome", {
            state: { userEmail: formData.email, userName: data.employeeName },
          });
        }, 2000);
      } else {
        const errorData = await response.json();
        // Add 2 second timeout before showing error
        setTimeout(() => {
          setErrorMessage(errorData.message || "Sign-in failed");
          setIsSubmitting(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      // Add 2 second timeout before showing error
      setTimeout(() => {
        setErrorMessage("An error occurred. Please try again later.");
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/meetingImage.jpg")'}}>
      <div>
        <Navbar isLoggedIn={isLoggedIn} employeeName={formData.email} />
        <div className="flex items-center justify-center pt-16">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

            {errorMessage && (
              <p className="text-red-600 text-center p-2 mb-4 rounded-md bg-red-100">
                {errorMessage}
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-sm mt-4">
              <Link
                to="/reset-password"
                className="text-sky-800 hover:underline"
              >
                Forgot Password?
              </Link>
              {" | "}
              <Link
                to="/register"
                className="text-sky-800 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
