// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Navbar({ isLoggedIn, employeeName }) {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const API_END_POINT = "http://localhost:8222/api/employees";
//   const token = sessionStorage.getItem("authToken");
//   const userId = sessionStorage.getItem("userId");

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleProfileClick = () => {
//     setShowDropdown(!showDropdown);
//   };

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch(`${API_END_POINT}/getAll`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         setEmployees(data.employees || []);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredEmployees([]);
//     } else {
//       const lowercasedTerm = searchQuery.toLowerCase();
//       setFilteredEmployees(
//         employees.filter(
//           (emp) =>
//             emp.empId !== userId &&
//             (emp.empId.toLowerCase().includes(lowercasedTerm) ||
//             emp.empName.toLowerCase().includes(lowercasedTerm) ||
//             emp.empEmail.toLowerCase().includes(lowercasedTerm))
//         )
//       );
//     }
//   }, [searchQuery, employees, userId]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Searching for:", searchQuery);
//   };

//   return (
//     <nav className="bg-sky-800 p-3 shadow-md">
//       <div className="container mx-auto max-w-6xl flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <img
//             src="https://th.bing.com/th?id=OIP.OQPmorjMA98lRVYZXXHJYAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
//             alt="App Icon"
//             onClick={() => navigate("/")}
//             className="h-8 w-8 rounded-full shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300 cursor-pointer"
//           />
//           <h1
//             onClick={() => navigate("/")}
//             className="text-white text-2xl font-bold tracking-wide cursor-pointer hover:text-sky-200 transition-colors duration-300"
//           >
//             ConvoHub
//           </h1>
//         </div>

//         {isLoggedIn && (
//           <div className="hidden lg:flex items-center space-x-6">
//             <Link
//               to="/dashboard"
//               className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
//             >
//               View Meetings
//             </Link>
//             <Link
//               to="/create-meeting"
//               className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
//             >
//               New Meeting
//             </Link>
//             <Link
//               to="/chat-comp"
//               className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
//             >
//               chats
//             </Link>
//             <Link
//               to="/calendar"
//               className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
//             >
//               Calendar
//             </Link>
          

          
//             <form onSubmit={handleSearch} className="relative">
//               <input
//                 type="text"
//                 placeholder="Search People"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="bg-white bg-opacity-20 text-black placeholder-sky-200 pl-3 pr-8 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all duration-300 text-xs w-56"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </button>
//               {filteredEmployees.length > 0 && (
//                 <ul className="absolute top-full left-0 mt-1 bg-white text-sky-800 w-full rounded-md shadow-lg overflow-hidden max-h-40 overflow-y-auto">
//                   {filteredEmployees.map((emp) => (
//                     <li
//                       key={emp.empId}
//                       onClick={() => navigate(`/profile/${emp.empId}`)}
//                       className="px-3 py-1 hover:bg-sky-100 cursor-pointer transition-colors duration-200 text-xs"
//                     >
//                       {emp.empId} - {emp.empName} ({emp.empEmail})
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </form>
//             <div className="relative">
//               <button
//                 onClick={handleProfileClick}
//                 className="flex items-center space-x-1 text-white hover:text-sky-200 transition duration-300"
//               >
//                 <span className="font-medium text-xs">{employeeName}</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z"
//                   />
//                 </svg>
//               </button>
//               {showDropdown && (
//                 <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg p-1 w-40 z-50">
//                   <Link
//                     to={`/profile/${sessionStorage.getItem("userId")}`}
//                     className="block text-sky-700 hover:bg-sky-100 px-3 py-1 rounded transition-colors duration-200 text-xs"
//                   >
//                     View Profile
//                   </Link>
//                   <button
//                     onClick={() => {
//                       sessionStorage.removeItem("authToken");
//                       navigate("/signin");
//                     }}
//                     className="block text-sky-700 hover:bg-sky-100 px-3 py-1 w-full text-left rounded transition-colors duration-200 text-xs"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <button
//           onClick={toggleMenu}
//           className="lg:hidden text-white focus:outline-none hover:text-sky-200 transition-colors duration-200"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             className="w-5 h-5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//       </div>

//       {isMenuOpen && isLoggedIn && (
//         <div className="lg:hidden mt-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-md shadow-md p-3">
//           <Link
//             to="/dashboard"
//             onClick={toggleMenu}
//             className="block text-white font-medium hover:text-sky-200 py-1 transform hover:translate-x-2 transition-all duration-200 text-xs"
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/example-meeting"
//             onClick={toggleMenu}
//             className="block text-white font-medium hover:text-sky-200 py-1 transform hover:translate-x-2 transition-all duration-200 text-xs"
//           >
//             Schedule Meeting
//           </Link>
//           <Link
//             to="/calendar"
//             onClick={toggleMenu}
//             className="block text-white font-medium hover:text-sky-200 py-1 transform hover:translate-x-2 transition-all duration-200 text-xs"
//           >
//             Calendar
//           </Link>
//           <Link
//             to="/chat"
//             onClick={toggleMenu}
//             className="block text-white font-medium hover:text-sky-200 py-1 transform hover:translate-x-2 transition-all duration-200 text-xs"
//           >
//             Chat
//           </Link>
//           <form onSubmit={handleSearch} className="mt-2">
//             <input
//               type="text"
//               placeholder="Search People"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white bg-opacity-20 text-white placeholder-sky-200 pl-3 pr-8 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all duration-300 text-xs"
//             />
//           </form>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;




import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, employeeName }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const API_END_POINT = "http://localhost:8222/api/employees";
  const token = sessionStorage.getItem("authToken");
  const userId = sessionStorage.getItem("userId");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees([]);
    } else {
      const lowercasedTerm = searchQuery.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.empId !== userId &&
            (emp.empId.toLowerCase().includes(lowercasedTerm) ||
              emp.empName.toLowerCase().includes(lowercasedTerm) ||
              emp.empEmail.toLowerCase().includes(lowercasedTerm))
        )
      );
    }
  }, [searchQuery, employees, userId]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-sky-800 p-3 shadow-md">
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="https://th.bing.com/th?id=OIP.OQPmorjMA98lRVYZXXHJYAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="App Icon"
            onClick={() => navigate("/")}
            className="h-8 w-8 rounded-full shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300 cursor-pointer"
          />
          <h1
            onClick={() => navigate("/")}
            className="text-white text-2xl font-bold tracking-wide cursor-pointer hover:text-sky-200 transition-colors duration-300"
          >
            ConvoHub
          </h1>
        </div>

        {isLoggedIn && (
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
            >
              View Meetings
            </Link>
            <Link
              to="/create-meeting"
              className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
            >
              New Meeting
            </Link>
            <Link
              to="/chat-comp"
              className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
            >
              Chats
            </Link>
            <Link
              to="/calendar"
              className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
            >
              Calendar
            </Link>

            {/* Task Manage Link */}
            <Link
              to="/task-manage"
              className="text-white font-medium hover:text-sky-200 transition-colors duration-200 text-sm transform hover:scale-110"
            >
              Task Manage
            </Link>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search People"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white bg-opacity-20 text-black placeholder-sky-200 pl-3 pr-8 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all duration-300 text-xs w-56"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              {filteredEmployees.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 bg-white text-sky-800 w-full rounded-md shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                  {filteredEmployees.map((emp) => (
                    <li
                      key={emp.empId}
                      onClick={() => navigate(`/profile/${emp.empId}`)}
                      className="px-3 py-1 hover:bg-sky-100 cursor-pointer transition-colors duration-200 text-xs"
                    >
                      {emp.empId} - {emp.empName} ({emp.empEmail})
                    </li>
                  ))}
                </ul>
              )}
            </form>

            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-1 text-white hover:text-sky-200 transition duration-300"
              >
                <span className="font-medium text-xs">{employeeName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg p-1 w-40 z-50">
                  <Link
                    to={`/profile/${sessionStorage.getItem("userId")}`}
                    className="block text-sky-700 hover:bg-sky-100 px-3 py-1 rounded transition-colors duration-200 text-xs"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("authToken");
                      navigate("/signin");
                    }}
                    className="block text-sky-700 hover:bg-sky-100 px-3 py-1 w-full text-left rounded transition-colors duration-200 text-xs"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={toggleMenu}
          className="lg:hidden text-white focus:outline-none hover:text-sky-200 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && isLoggedIn && (
        <div className="lg:hidden mt-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-md shadow-md p-3">
          <Link
            to="/dashboard"
            onClick={toggleMenu}
            className="block text-white font-medium hover:text-sky-200 py-1 transform hover:translate-x-2 transition-all duration-200 text-xs"
          >
            Dashboard
          </Link>
          <Link
            to="/task-manage"
            onClick={toggleMenu}
            className="block text-white font-medium hover:text-sky-200 py-1 transform hover:translate-x-2 transition-all duration-200 text-xs"
          >
            Task Manage
          </Link>
          {/* Other links */}
          <form onSubmit={handleSearch} className="mt-2">
            <input
              type="text"
              placeholder="Search People"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-sky-200 pl-3 pr-8 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all duration-300 text-xs"
            />
          </form>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
