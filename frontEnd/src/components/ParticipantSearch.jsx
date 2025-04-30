import React, { useState, useEffect } from "react";

const ParticipantSearch = ({ onSelectEmployee }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const API_END_POINT = "http://localhost:8222/api/employees";
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    // Fetch employees when component mounts
    const fetchEmployees = async () => {
      console.log(token);
      try {
        const response = await fetch(API_END_POINT + "/getAll", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
        const data = await response.json();
        console.log(data);
        setEmployees(data.employees || []);
        console.log(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search term
    const lowercasedTerm = searchTerm.toLowerCase();
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.empId.toLowerCase().includes(lowercasedTerm) ||
          emp.empName.toLowerCase().includes(lowercasedTerm) ||
          emp.empEmail.toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [searchTerm, employees]);

  return (
    <div>
      <label>Search Employees:</label>
      <input
        type="text"
        placeholder="Search by eid, name, or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredEmployees.map((emp) => (
          <li key={emp.empId} onClick={() => onSelectEmployee(emp.empId)}>
            {emp.empId} - {emp.empName} ({emp.empEmail})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantSearch;
