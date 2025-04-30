import React, { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";

function MeetingList({ meet, selectDate }) {
  const [employeeTimezone, setEmployeeTimezone] = useState("");
  const [selectedDate, setSelectedDate] = useState(selectDate);
  const [viewMode, setViewMode] = useState("allMeetings");
  const token = sessionStorage.getItem("authToken");
  const userId = sessionStorage.getItem("userId");
  const [confirmedMeetings, setConfirmedMeetings] = useState([]);
  const [meetings, setMeetings] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantStatus, setParticipantStatus] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [meetingToCancel, setMeetingToCancel] = useState(null);
  const [hoveredMeeting, setHoveredMeeting] = useState(null);
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmingMeeting, setConfirmingMeeting] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [meetingToConfirm, setMeetingToConfirm] = useState(null);

  useEffect(() => {
    if (meet) {
      setMeetings([...meet]);
    }
  }, [meet]);

  useEffect(() => {
    const fetchEmployeeTimezone = async () => {
      try {
        const email = sessionStorage.getItem("email");
        const response = await fetch(
          `http://localhost:8222/api/employees/get-by-email/${email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setEmployeeTimezone(data.employee.empTimezone);
      } catch (error) {
        console.error("Error fetching employee timezone:", error);
      }
    };
    fetchEmployeeTimezone();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchParticipantStatus = async () => {
        try {
            const response = await fetch(
                `http://localhost:8222/api/participants/get-status/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setParticipantStatus(data); 
                const confirmedIds = data
                    .filter((participant) => participant.status === true)
                    .map((participant) => participant.meetId);
                setConfirmedMeetings(confirmedIds); 
            } else {
                console.error("Failed to fetch participant status");
            }
        } catch (error) {
            console.error("Error fetching participant status:", error);
        }
    };

    fetchParticipantStatus();
}, [userId, token]);


  const convertToLocalTime = (utcTime) => {
    if (employeeTimezone) {
      return DateTime.fromISO(utcTime, { zone: "utc" })
        .setZone(employeeTimezone)
        .toLocaleString(DateTime.DATETIME_MED);
    } else {
      return utcTime;
    }
  };

  const filteredMeetings = meetings
    ? meetings.filter((meeting) => {
        const meetingDateTime = DateTime.fromISO(meeting.meetStartDateTime);
        const now = DateTime.now();

        if (selectedDate) {
          return meetingDateTime.hasSame(DateTime.fromISO(selectedDate), "day");
        } else {
          if (viewMode === "allMeetings") {
            return true;
          } else if (viewMode === "hosted") {
            return meeting.meetHostId === userId;
          } else if (viewMode === "toAttend") {
            return meeting.meetHostId !== userId && meetingDateTime > now;
          } else if (viewMode === "past") {
            return meetingDateTime < now;
          }
        }
        return false;
      })
    : [];

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleCancelMeeting = async (meetingId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8222/api/meetings/delete/${meetingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // to pass the reason.
          body: JSON.stringify({ reason: cancellationReason }),
        }
      );
      if (response.ok) {
        setMeetings((prevMeetings) =>
          prevMeetings.filter((meeting) => meeting.meetId !== meetingId)
        );
        console.log("Meeting cancelled successfully");
      } else {
        console.error("Failed to cancel meeting");
      }
    } catch (error) {
      console.error("Error cancelling meeting:", error);
    } finally {
      setIsLoading(false);
      setCancellationReason("");
    }
  };

  const handleConfirmMeeting = async (meetingId) => {
    setConfirmingMeeting(meetingId);
    try {
      const response = await fetch(
        `http://localhost:8222/api/participants/update-status/${userId}/${meetingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Meeting confirmed successfully");
        setConfirmedMeetings([...confirmedMeetings, meetingId]);
        setParticipantStatus((prevStatus) =>
          prevStatus.map((p) =>
            p.empId === userId && p.meetId === meetingId ? { ...p, status: true } : p
          )
        );
      } else {
        console.error("Failed to confirm meeting");
      }
    } catch (error) {
      console.error("Error confirming meeting:", error);
    } finally {
      setConfirmingMeeting(null);
      setShowConfirmPrompt(false);
      setMeetingToConfirm(null);
    }
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowParticipants(false);
    setParticipants([]);
  };

  const handleClosePopup = () => {
    setSelectedMeeting(null);
    setShowParticipants(false);
    setParticipants([]);
  };

  const handleShowParticipants = async () => {
    if (!showParticipants && selectedMeeting) {
      try {
        const response = await fetch(
          `http://localhost:8222/api/participants/meeting-participants-details/${selectedMeeting.meetId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setParticipantStatus(data);
          const empIds = data.map(participant => participant.empId);

          const empResponse = await fetch(
            `http://localhost:8222/api/employees/get-employee-by-ids`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(empIds ),
            }
          );

          if (empResponse.ok) {
            const empData = await empResponse.json();
            setParticipants(empData);
          } else {
            console.error("Failed to fetch employee names");
          }
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    }
    setShowParticipants(!showParticipants);
  };

  const handleDropdownToggle = (meetingId) => {
    setShowDropdown(showDropdown === meetingId ? null : meetingId);
  };

  const handleCancelClick = (meetingId) => {
    setMeetingToCancel(meetingId);
    setShowConfirmation(true);
    setShowDropdown(null);
  };

  const handleConfirmCancel = () => {
    if (meetingToCancel) {
      handleCancelMeeting(meetingToCancel);
      setShowConfirmation(false);
      setMeetingToCancel(null);
    }
  };

  const handleCancelCancellation = () => {
    setShowConfirmation(false);
    setMeetingToCancel(null);
    setCancellationReason("");
  };

  const handleConfirmClick = (meetingId) => {
    setMeetingToConfirm(meetingId);
    setShowConfirmPrompt(true);
  };

  const handleConfirmYes = () => {
    if (meetingToConfirm) {
      handleConfirmMeeting(meetingToConfirm);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirmPrompt(false);
    setMeetingToConfirm(null);
  };

  if (!meetings) {
    return <p>Loading meetings...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            {selectedDate
              ? `Meetings for ${DateTime.fromISO(selectedDate).toLocaleString(
                  DateTime.DATE_FULL
                )}`
              : viewMode === "allMeetings"
              ? "All Meetings"
              : viewMode === "hosted"
              ? "Hosted Meetings"
              : viewMode === "toAttend"
              ? "Upcoming Meetings"
              : "Past Meetings"}
          </h3>
          {selectedDate && (
            <button
              className="bg-sky-800 text-white px-4 py-2 rounded"
              onClick={handleClearDate}
            >
              Clear Date
            </button>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "allMeetings"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("allMeetings")}
          >
            All Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "hosted"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("hosted")}
          >
            Hosted Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "toAttend"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("toAttend")}
          >
            Upcoming Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "past"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("past")}
          >
            Past Meetings
          </button>
        </div>
      </div>
      {filteredMeetings.length > 0 ? (
        <div className="space-y-4">
          {filteredMeetings.map((meeting, index) => (
            <div
              key={index}
              className={`bg-white shadow-lg rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                hoveredMeeting === meeting.meetId ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleMeetingClick(meeting)}
              onMouseEnter={() => setHoveredMeeting(meeting.meetId)}
              onMouseLeave={() => setHoveredMeeting(null)}
            >
              <div className="flex-grow">
                <h4 className="text-lg font-semibold">{meeting.meetName}</h4>
                <p className="text-sm text-gray-600">{meeting.meetDescription}</p>
                <p className="text-sm text-gray-500">
                  {convertToLocalTime(meeting.meetStartDateTime)} - {convertToLocalTime(meeting.meetEndDateTime)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {meeting.meetHostId === userId ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownToggle(meeting.meetId);
                      }}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </button>
                    {showDropdown === meeting.meetId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelClick(meeting.meetId);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : participantStatus.find(p => p.empId === userId && p.meetId === meeting.meetId)?.status === true || confirmedMeetings.includes(meeting.meetId) ? (
                  <span className="text-green-800 font-semibold">
                    Confirmed
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmMeeting(meeting.meetId);

                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No meetings found for this selection.
        </p>
      )}

      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedMeeting.meetName}</h2>
            <p className="mb-2"><strong>Description:</strong> {selectedMeeting.meetDescription}</p>
            <p className="mb-2"><strong>Host ID:</strong> {selectedMeeting.meetHostId}</p>
            <p className="mb-2"><strong>Start Time:</strong> {convertToLocalTime(selectedMeeting.meetStartDateTime)}</p>
            <p className="mb-2"><strong>End Time:</strong> {convertToLocalTime(selectedMeeting.meetEndDateTime)}</p>
            
            <button
              onClick={handleShowParticipants}
              className="bg-sky-800 text-white px-4 py-2 rounded mt-4"
            >
              {showParticipants ? "Hide Participants" : "Show Participants"}
            </button>

            {showParticipants && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Participants</h3>
                {participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants.map((participant) => {
                      const status = participantStatus.find(
                        (p) => p.empId === participant.empId
                      );
                      const statusText = status && status.status ? "Confirmed" : "Pending";
                      const statusColor = status && status.status ? "text-green-600" : "text-yellow-600";
                      return (
                        <div key={participant.empId} className="flex items-center justify-between p-2 bg-gray-100 rounded-full text-sm">
                          <span className="font-semibold ml-4">{participant.empName}</span>
                          <span className={`mr-4 ${statusColor}`}>{statusText}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>Loading participants...</p>
                )}
              </div>
            )}

            <button
              onClick={handleClosePopup}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mt-4 ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Cancellation</h2>
            <p className="mb-4">Are you sure you want to cancel this meeting?</p>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="3"
              placeholder="Enter reason for cancellation"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelCancellation}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                No, Keep
              </button>
              <button
                onClick={handleConfirmCancel}
                className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading || !cancellationReason.trim()}
              >
                {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Meeting</h2>
            <p className="mb-4">Are you sure you want to confirm this meeting?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmNo}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                No
              </button>
              <button
                onClick={handleConfirmYes}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingList;
