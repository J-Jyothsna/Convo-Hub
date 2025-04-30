import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { DateTime } from "luxon";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const { empId } = useParams();
  const endpointUrl = `http://localhost:8222/api/employees/get/${empId}`;
  const token = sessionStorage.getItem("authToken");
  const UserTimezone = sessionStorage.getItem("creatorTimezone");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(endpointUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employee details");
        }
        const data = await response.json();
        setEmployee(data.employee);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEmployeeDetails();
  }, [endpointUrl, token]);

  const convertToLocalTime = (utcTime, fromTimezone, toTimezone) => {
    return DateTime.fromISO(utcTime, { zone: fromTimezone })
      .setZone(toTimezone)
      .toLocaleString(DateTime.TIME_24_SIMPLE);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-300">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />

      {employee ? (
        <div className="container mx-auto p-8 mt-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Profile Picture and Basic Info */}
            <div className="md:w-1/3">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-sky-600 h-32 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-sky-800">
                    {employee.empName.charAt(0)}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-sky-800 mb-2">{employee.empName}</h2>
                  <p className="text-lg text-sky-600 mb-4">{employee.empDesignation}</p>
                  <ProfileItem icon="📧" label="Email" value={employee.empEmail} />
                  <ProfileItem icon="📞" label="Phone" value={employee.empPhone} />
                </div>
              </div>
            </div>

            {/* Right column - Additional Details */}
            <div className="md:w-2/3">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold text-sky-800 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileItem icon="🏙️" label="City" value={employee.empCity} />
                  <ProfileItem icon="🌐" label="Timezone" value={employee.empTimezone} />
                  <ProfileItem 
                    icon="⏰" 
                    label="Work Hours" 
                    value={`${convertToLocalTime(employee.empStartTime, "utc", UserTimezone)} - ${convertToLocalTime(employee.empEndTime, "utc", UserTimezone)}`} 
                    subValue={`(${UserTimezone})`}
                  />
                </div>
              </div>

              {/* Additional sections can be added here */}
              <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold text-sky-800 mb-4">Work History</h3>
                {/* Add work history content here */}
                <p className="text-gray-600">Work history information can be displayed here.</p>
              </div>

              <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold text-sky-800 mb-4">Skills</h3>
                {/* Add skills content here */}
                <p className="text-gray-600">Employee skills can be listed here.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-600"></div>
        </div>
      )}
    </div>
  );
};

const ProfileItem = ({ icon, label, value, subValue }) => (
  <div className="flex items-start space-x-3 p-4 bg-sky-50 rounded-lg transition-all duration-300 hover:bg-sky-100 hover:shadow-md">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-gray-600 font-medium text-sm">{label}</p>
      <p className="text-sky-800 font-semibold">{value}</p>
      {subValue && <p className="text-sky-600 text-sm">{subValue}</p>}
    </div>
  </div>
);

export default Profile;
