import React, { useState, useEffect } from "react";
import MeetingList from "./MeetingList";
import Navbar from "./Navbar";

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Initially null
  const token = sessionStorage.getItem("authToken");
  const empId = sessionStorage.getItem("userId");
  const API_END_POINT = `http://localhost:8222/api/participants`;

  useEffect(() => {
    const fetchMeetings = async () => {
      console.log(selectedDate);
      try {
        const response = await fetch(
          selectedDate
            ? `${API_END_POINT}/${empId}/meetings?date=${selectedDate}`
            : `${API_END_POINT}/${empId}/meetings-of-id`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }

        const data = await response.json();
        setMeetings(data.meetings || []);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings([]);
      }
    };

    fetchMeetings();
  }, [API_END_POINT, empId, selectedDate, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={!!token} />
      <div className="container mx-auto px-4 mt-8">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <label
              htmlFor="date-select"
              className="block text-sm font-medium text-gray-700"
            >
              Select Date:
            </label>
            <div className="flex items-center mt-1">
              <input
                type="date"
                id="date-select"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={() => setSelectedDate(null)}
                className="ml-2 px-3 py-2 bg-sky-800 text-white text-sm rounded-md shadow-sm hover:bg-sky-900 transition duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      
        <MeetingList meet={meetings} selectDate={selectedDate} />
      </div>
    </div>
  );
}

export default Dashboard;
