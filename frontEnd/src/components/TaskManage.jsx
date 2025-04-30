import React from "react";
import { useNavigate } from "react-router-dom"; // Optional for navigation

const TaskManage = () => {
  const navigate = useNavigate(); // Optional for routing, if needed
  
  const handleRedirect = () => {
    // Redirect to Notion website
    window.location.href = "https://www.notion.so"; 
  };

  return (
    <div className="taskmanage-container">
      <h1>Welcome to ConvoHub!</h1>
      <p>Your professional chat, team, and task management platform.</p>
      <button
        className="btn-notion"
        onClick={handleRedirect}
      >
        Go to Notion
      </button>
    </div>
  );
};

export default TaskManage;
