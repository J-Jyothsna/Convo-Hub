import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

function Register() {
  const API_END_POINT = "http://localhost:8222/api/auth";
  const API_END_POINT_EMP = "http://localhost:8222/api/employees";
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const validate = () => {
    let errors = {};
    if (!formData.id) errors.id = "ID is required";

    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email address is invalid";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) errors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Add 2 second delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch(API_END_POINT + "/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const userData = await response.json();

        if (response.ok) {
          setServerMessage(userData.message);
          navigate("/signin");
        } else {
          console.log(userData.message);
          setServerMessage(userData.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setServerMessage("Server is down. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/meetingImage.jpg")'}}>
      <div className="min-h-screen bg-black bg-opacity-50">
        <Navbar /> {/* Navbar positioned at the top */}
        <div className="flex items-center justify-center pt-16">
          <form
            className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-semibold text-center mb-4">Register</h2>

            {/* Server Message */}
            {serverMessage && (
              <p
                className={`text-center p-2 mb-4 rounded-md ${
                  serverMessage.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {serverMessage}
              </p>
            )}

            {/* Employee ID */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.id && (
                <p className="text-red-600 text-xs mt-1">{errors.id}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {formData.confirmPassword && !passwordMatch && (
                <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
              )}
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !passwordMatch}
              className={`w-full bg-sky-800 text-white py-2 rounded-md transition duration-300 
                ${
                  (isSubmitting || !passwordMatch)
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-sky-900"
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm mt-3">
              Already have an account?{" "}
              <Link to="/signin" className="text-sky-800 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
