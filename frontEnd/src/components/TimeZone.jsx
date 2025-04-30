import React from "react";
import "./EmployeeBars.css";
import { DateTime } from "luxon"; // Use Luxon for timezone handling

const EmployeeBars = () => {
  // Determine the user's local time zone
  const employees = [
    {
      name: "Alice",
      timezone: "America/New_York",
      startWorkTime: "9:00",
      endWorkTime: "18:00",
    },
    {
      name: "Bob",
      timezone: "Europe/London",
      startWorkTime: "10:00",
      endWorkTime: "19:00",
    },
    {
      name: "Charlie",
      timezone: "Asia/Tokyo",
      startWorkTime: "8:00",
      endWorkTime: "17:00",
    },
  ];

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Helper function to calculate box indices in the user's local time
  const getBoxIndices = (startTime, endTime, employeeTimeZone) => {
    const toUserLocalHour = (time, timeZone) => {
      const [hour, minute] = time.split(":").map(Number);
      return DateTime.fromObject({ hour, minute }, { zone: timeZone })
        .toUTC() // Convert to UTC
        .setZone(userTimeZone).hour; // Convert UTC to the user's local time zone
    };

    const startLocalHour = toUserLocalHour(startTime, employeeTimeZone);
    const endLocalHour = toUserLocalHour(endTime, employeeTimeZone);

    return {
      start: (startLocalHour + 24) % 72, // Handle wrapping around
      end: (endLocalHour + 24) % 72,
    };
  };

  return (
    <div className="employee-container">
      {employees.map((employee, index) => {
        const { start, end } = getBoxIndices(
          employee.startWorkTime,
          employee.endWorkTime,
          employee.timezone
        );

        return (
          <div className="employee-row" key={index}>
            <div className="employee-name">{employee.name}</div>
            <div className="employee-bar">
              {[...Array(72)].map((_, boxIndex) => (
                <div
                  key={boxIndex}
                  className={`box ${
                    boxIndex >= start && boxIndex < end ? "highlight" : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeBars;
