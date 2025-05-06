// import React, { useEffect, useState } from "react";
// import { FaSearch, FaBell } from "react-icons/fa";

// const ChatApp = () => {
//   const [currentChatUser, setCurrentChatUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadMessages, setUnreadMessages] = useState({});
//   const [messages, setMessages] = useState([]);
//   const senderId = sessionStorage.getItem("userId");
//   const token = sessionStorage.getItem("authToken");
//   const API_END_POINT = "http://localhost:8222/api/employees";

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
//         fetchUnreadMessages();
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchEmployees();

//     // Set up polling for new messages
//     const pollInterval = setInterval(fetchUnreadMessages, 10000);
//     return () => clearInterval(pollInterval);
//   }, []);

//   const fetchUnreadMessages = async () => {
//     if (!senderId || !token) {
//       console.error("Missing senderId or token");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8222/api/messages/unread/${senderId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Group messages by senderId instead of receiverId
//       const groupedMessages = {};
//       data.forEach((message) => {
//         if (!groupedMessages[message.senderId]) {
//           groupedMessages[message.senderId] = [];
//         }
//         groupedMessages[message.senderId].push(message);
//       });

//       setUnreadMessages(groupedMessages);

//       // Update unread counts
//       const counts = {};
//       Object.keys(groupedMessages).forEach((senderId) => {
//         counts[senderId] = groupedMessages[senderId].length;
//       });
//       setUnreadCounts(counts);
//     } catch (error) {
//       console.error("Error fetching unread messages:", error);
//     }
//   };

//   const fetchMessages = async (userId) => {
//     try {
//       // Fetch all messages between current user and selected user in both directions
//       const [sentMessages, receivedMessages] = await Promise.all([
//         fetch(
//           `http://localhost:8222/api/messages/${senderId}/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         ).then(res => res.json()),
//         fetch(
//           `http://localhost:8222/api/messages/${userId}/${senderId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         ).then(res => res.json())
//       ]);

//       // Combine and sort all messages by timestamp
//       const allMessages = [...sentMessages, ...receivedMessages];
//       setMessages(
//         allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
//       );
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const handleUserSelection = async (userId) => {
//     setCurrentChatUser(userId);
//     setShowNotifications(false);
//     fetchMessages(userId);

//     // Mark messages from this user as read
//     if (unreadMessages[userId]) {
//       try {
//         const messageIds = unreadMessages[userId].map((message) => message.id);

//         const response = await fetch(
//           `http://localhost:8222/api/messages/mark-as-read`,
//           {
//             method: "PUT",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(messageIds),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Update unread counts and messages
//         setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
//         setUnreadMessages((prev) => {
//           const updated = { ...prev };
//           delete updated[userId];
//           return updated;
//         });
//       } catch (error) {
//         console.error("Error marking messages as read:", error);
//       }
//     }
//   };

//   const getTotalUnreadCount = () => {
//     return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getCurrentChatUserName = () => {
//     const user = employees.find((emp) => emp.empId === currentChatUser);
//     return user?.empName || "";
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-white shadow-lg">
//         <div className="p-4 border-b flex justify-between items-center">
//           <div className="relative flex-1 mr-4">
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute right-3 top-3 text-gray-400" />
//           </div>
//           <div className="relative">
//             <button
//               className="relative p-2 hover:bg-gray-100 rounded-full"
//               onClick={() => setShowNotifications(!showNotifications)}
//             >
//               <FaBell className="text-gray-600 text-xl" />
//               {getTotalUnreadCount() > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
//                   {getTotalUnreadCount()}
//                 </span>
//               )}
//             </button>

//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto">
//                 {Object.keys(unreadMessages).length > 0 ? (
//                   Object.entries(unreadMessages).map(([senderId, messages]) => {
//                     const sender = employees.find(
//                       (emp) => emp.empId === senderId
//                     );
//                     return (
//                       <div
//                         key={senderId}
//                         className="p-3 border-b hover:bg-gray-50 cursor-pointer"
//                         onClick={() => handleUserSelection(senderId)}
//                       >
//                         <div className="font-semibold">{sender?.empName}</div>
//                         <div className="text-sm text-gray-500">
//                           {messages.length} unread messages
//                         </div>
//                         <div className="text-sm text-gray-600 truncate">
//                           Latest: {messages[messages.length - 1].content}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="p-3 text-center text-gray-500">
//                     No unread messages
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="overflow-y-auto h-[calc(100vh-80px)]">
//           {filteredEmployees.map((user) => (
//             <div
//               key={user.empId}
//               className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
//                 currentChatUser === user.empId ? "bg-blue-50" : ""
//               }`}
//               onClick={() => handleUserSelection(user.empId)}
//             >
//               <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
//                 {user.empName.charAt(0)}
//               </div>
//               <div className="ml-4 flex-1">
//                 <h3 className="font-semibold">{user.empName}</h3>
//                 <p className="text-sm text-gray-500">{user.empEmail}</p>
//               </div>
//               {unreadCounts[user.empId] > 0 && (
//                 <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
//                   {unreadCounts[user.empId]}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 bg-white ml-4 rounded-lg shadow-lg flex flex-col">
//         {currentChatUser ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-semibold">
//                 Chat with {getCurrentChatUserName()}
//               </h2>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`mb-4 ${
//                     message.senderId === senderId ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <div
//                     className={`inline-block p-3 rounded-lg ${
//                       message.senderId === senderId
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200"
//                     }`}
//                   >
//                     <p>{message.content}</p>
//                     <span className="text-xs opacity-75">
//                       {new Date(message.timestamp).toLocaleTimeString()}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <p>Select a user to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatApp;




import React, { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const ChatApp = () => {
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const senderId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");
  const API_END_POINT = "http://localhost:8222/api/employees";

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
        fetchUnreadMessages();
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();

    const pollInterval = setInterval(fetchUnreadMessages, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  const fetchUnreadMessages = async () => {
    if (!senderId || !token) return;

    try {
      const response = await fetch(
        `http://localhost:8222/api/messages/unread/${senderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const groupedMessages = {};
      data.forEach((message) => {
        if (!groupedMessages[message.senderId]) {
          groupedMessages[message.senderId] = [];
        }
        groupedMessages[message.senderId].push(message);
      });

      setUnreadMessages(groupedMessages);

      const counts = {};
      Object.keys(groupedMessages).forEach((senderId) => {
        counts[senderId] = groupedMessages[senderId].length;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const [sentMessages, receivedMessages] = await Promise.all([
        fetch(
          `http://localhost:8222/api/messages/${senderId}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json()),
        fetch(
          `http://localhost:8222/api/messages/${userId}/${senderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json()),
      ]);

      const allMessages = [...sentMessages, ...receivedMessages];
      setMessages(
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserSelection = async (userId) => {
    setCurrentChatUser(userId);
    setShowNotifications(false);
    fetchMessages(userId);

    if (unreadMessages[userId]) {
      try {
        const messageIds = unreadMessages[userId].map((msg) => msg.id);

        const response = await fetch(
          `http://localhost:8222/api/messages/mark-as-read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messageIds),
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
        setUnreadMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentChatUserName = () => {
    const user = employees.find((emp) => emp.empId === currentChatUser);
    return user?.empName || "";
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const senderZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        `http://localhost:8222/api/messages/send?senderId=${senderId}&senderZoneId=${encodeURIComponent(
          senderZoneId
        )}&receiverId=${currentChatUser}&content=${encodeURIComponent(newMessage)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const message = {
        senderId,
        receiverId: currentChatUser,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell className="text-gray-600 text-xl" />
              {getTotalUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {getTotalUnreadCount()}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto">
                {Object.keys(unreadMessages).length > 0 ? (
                  Object.entries(unreadMessages).map(([senderId, messages]) => {
                    const sender = employees.find(
                      (emp) => emp.empId === senderId
                    );
                    return (
                      <div
                        key={senderId}
                        className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleUserSelection(senderId)}
                      >
                        <div className="font-semibold">{sender?.empName}</div>
                        <div className="text-sm text-gray-500">
                          {messages.length} unread messages
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          Latest: {messages[messages.length - 1].content}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No unread messages
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {filteredEmployees.map((user) => (
            <div
              key={user.empId}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                currentChatUser === user.empId ? "bg-blue-50" : ""
              }`}
              onClick={() => handleUserSelection(user.empId)}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.empName.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{user.empName}</h3>
                <p className="text-sm text-gray-500">{user.empEmail}</p>
              </div>
              {unreadCounts[user.empId] > 0 && (
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {unreadCounts[user.empId]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white ml-4 rounded-lg shadow-lg flex flex-col">
        {currentChatUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">
                Chat with {getCurrentChatUserName()}
              </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.senderId === senderId ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.senderId === senderId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 rounded-lg border border-gray-300"
              />
              <button
                onClick={handleSendMessage}
                className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;

