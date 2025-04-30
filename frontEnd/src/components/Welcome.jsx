import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [profileData, setProfileData] = useState({
    id: "", name: "", role: "", email: "", contact: "", location: "",
    timezone: "", workHoursStart: "", workHoursEnd: "",
  });

  const API_BASE_URL = "http://localhost:8222/api/employees";
  const userEmail = location.state?.userEmail;

  useEffect(() => {
    if (userEmail) {
      fetchUserData(userEmail);
    } else {
      setIsProfileIncomplete(true);
    }
  }, [userEmail]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-by-email/${email}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        handleUserData(data.employee);
      } else if (response.status === 404) {
        setIsProfileIncomplete(true);
      } else {
        throw new Error("Failed to retrieve employee information");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsProfileIncomplete(true);
    }
  };

  const handleUserData = (employee) => {
    setUserData(employee);
    sessionStorage.setItem("userId", employee.empId);
    if (!employee.profileStatus) {
      setProfileData({
        id: employee.empId || "",
        name: employee.empName || "",
        role: employee.empDesignation || "",
        email: employee.empEmail || "",
        contact: employee.empPhone || "",
        location: employee.empCity || "",
        timezone: employee.empTimezone || "",
        workHoursStart: employee.empStartTime || "",
        workHoursEnd: employee.empEndTime || "",
      });
      setIsProfileIncomplete(true);
    } else {
      sessionStorage.setItem("creatorTimezone", employee.empTimezone);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/update-status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empId: profileData.id,
          empTimezone: profileData.timezone,
          empStartTime: profileData.workHoursStart,
          empEndTime: profileData.workHoursEnd,
        }),
      });
      if (response.ok) {
        sessionStorage.setItem("creatorTimezone", profileData.timezone);
        setIsProfileIncomplete(false);
        navigate("/dashboard");
      } else {
        console.error("Profile update failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/meetingImage.jpg")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
        <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white bg-opacity-90 shadow-xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                Welcome, {userData?.empName || userEmail}
              </h1>
              {isProfileIncomplete ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                    Complete Your Profile
                  </h2>
                  {Object.entries(profileData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      {key === "timezone" ? (
                        <select
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Timezone</option>
                          <option value="Asia/Kolkata">Mumbai (GMT+5:30)</option>
                          <option value="Europe/London">London (GMT+0/+1)</option>
                          <option value="America/New_York">New York (GMT-5/-4)</option>
                          <option value="America/Los_Angeles">Los Angeles (GMT-8/-7)</option>
                          <option value="Asia/Singapore">Singapore (GMT+8)</option>
                        </select>
                      ) : key === "workHoursStart" || key === "workHoursEnd" ? (
                        <input
                          type="time"
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <input
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={["id", "name", "email"].includes(key)}
                          readOnly={["id", "email"].includes(key)}
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                  >
                    Update Profile
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                      Your Profile
                    </h3>
                    {userData && (
                      <div className="space-y-2">
                        <ProfileDetail label="Name" value={userData.empName} />
                        <ProfileDetail label="Role" value={userData.empDesignation} />
                        <ProfileDetail label="Email" value={userData.empEmail} />
                        <ProfileDetail label="Location" value={userData.empCity} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-sky-800 text-white py-3 px-4 rounded-md hover:bg-sky-900 transition duration-300 transform hover:scale-105"
                  >
                    Find your meetings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileDetail = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-gray-600">{label}: </span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

export default Welcome;
