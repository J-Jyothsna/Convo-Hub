import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Navbar from "./Navbar";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [meetingsByDate, setMeetingsByDate] = useState({});
  const empId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchMeetingsForMonth();
  }, [currentDate]);

  const fetchMeetingsForMonth = async () => {
    const startOfMonth = currentDate.startOf("month");
    const daysInMonth = currentDate.daysInMonth;
    const newMeetingsByDate = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = startOfMonth.set({ day }).toISODate();

      try {
        const response = await fetch(
          `http://localhost:8222/api/participants/${empId}/meetings?date=${date}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch meetings for ${date}`);
          continue;
        }

        const data = await response.json();
        newMeetingsByDate[date] = data.meetings || [];
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    }

    setMeetingsByDate(newMeetingsByDate);
  };

  const daysInMonth = currentDate.daysInMonth;
  const firstDayOfMonth = currentDate.startOf("month").weekday;

  const calendarDays = [];
  for (let i = 1; i < firstDayOfMonth; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="p-2 border border-gray-200"></div>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = currentDate.set({ day });
    const isToday = DateTime.now().hasSame(currentDay, "day");
    const dayString = currentDay.toISODate();
    const dayMeetings = meetingsByDate[dayString] || [];

    calendarDays.push(
      <div
        key={day}
        className={`p-2 border border-gray-200 hover:bg-sky-50 cursor-pointer transition duration-300 ${
          isToday ? "bg-sky-100 font-bold" : ""
        }`}
      >
        <div className="text-right text-sm text-gray-500">{day}</div>
        <div className="max-h-24 overflow-y-auto">
          {dayMeetings.map((meeting, index) => (
            <div
              key={index}
              className="text-xs bg-sky-200 text-sky-800 p-1 mt-1 rounded truncate"
            >
              {meeting.meetName}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const previousMonth = () => {
    setCurrentDate(currentDate.minus({ months: 1 }));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.plus({ months: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isLoggedIn={!!token} />
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center bg-sky-600 text-white p-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-full hover:bg-sky-700 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">
              {currentDate.toFormat("MMMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-sky-700 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 bg-sky-100 font-semibold text-sky-800">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
