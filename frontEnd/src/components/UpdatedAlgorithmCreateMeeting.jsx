import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { DateTime } from "luxon";

const UpdatedAlgorithmCreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedParticipantsName, setSelectedParticipantsName] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [overlapResult, setOverlapResult] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [participantSchedules, setParticipantSchedules] = useState([]);
  const [hoveredTime, setHoveredTime] = useState(null);

  const API_END_POINT = "http://localhost:8222/api/employees";
  const MEETING_API_END_POINT = "http://localhost:8222/api/meetings/add";
  const PARTICIPANTS_API_END_POINT =
    "http://localhost:8222/api/participants/add";
  const token = sessionStorage.getItem("authToken");
  const creatorEmail = sessionStorage.getItem("email");
  const creatorTimezone = sessionStorage.getItem("creatorTimezone");

  useEffect(() => {
    const generateMeetingId = () =>
      `MEET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setMeetingId(generateMeetingId());
  }, []);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const response = await fetch(`${API_END_POINT}/getAll`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setParticipants(data.employees);
          const creator = data.employees.find(
            (participant) => participant.empEmail === creatorEmail
          );
          if (creator) {
            sessionStorage.setItem("creatorId", creator.empId);
            sessionStorage.setItem("creatorTimezone", creator.empTimezone);
            setSelectedParticipants([creator.empId]);
            setSelectedParticipantsName([creator]);
          }
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchParticipants();
  }, [API_END_POINT, token, creatorEmail]);

  const convertToLocalTime = (utcTime, fromTimezone, toTimezone) => {
    const originalTime = DateTime.fromISO(utcTime, { zone: fromTimezone });
    const convertedTime = originalTime.setZone(toTimezone);

    console.log(
      `Original time: ${originalTime.toFormat("HH:mm")} ${fromTimezone}`
    );
    console.log(
      `Converted time: ${convertedTime.toFormat("HH:mm")} ${toTimezone}`
    );

    const formattedTime = convertedTime.toFormat("HH:mm");
    const nextDay = convertedTime.day !== originalTime.day;

    return { time: formattedTime, nextDay };
  };

  const filteredParticipants = searchQuery
    ? participants.filter(
        (p) =>
          p.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.empId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.empEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : participants;

  const handleSelectParticipant = (participant) => {
    if (!selectedParticipants.some((p) => p === participant.empId)) {
      setSelectedParticipants([...selectedParticipants, participant.empId]);
      setSelectedParticipantsName([...selectedParticipantsName, participant]);
    }
    setSearchQuery("");
    setDropdownVisible(false);
    setShowTimeFields(false);
    setOverlapResult([]);
  };

  const handleRemoveParticipant = (participant) => {
    setSelectedParticipants(
      selectedParticipants.filter((p) => p !== participant.empId)
    );
    setSelectedParticipantsName(
      selectedParticipantsName.filter((p) => p.empId !== participant.empId)
    );
    setShowTimeFields(false);
    setOverlapResult([]);
  };

  const handleSearchFocus = () => {
    setDropdownVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_END_POINT + "/get-red-window", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingDate: meetingDate,
          listOfEmployeeId: selectedParticipants,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        const localTimeResult = result.map((item) => {
          const startTimeConverted = item.startTime
            ? convertToLocalTime(item.startTime, "utc", creatorTimezone)
            : { time: "No window found", nextDay: false };
          const endTimeConverted = item.endTime
            ? convertToLocalTime(item.endTime, "utc", creatorTimezone)
            : { time: "No window found", nextDay: false };

          return {
            ...item,
            startTime:
              startTimeConverted.time +
              (startTimeConverted.nextDay ? " (next day)" : ""),
            endTime:
              endTimeConverted.time +
              (endTimeConverted.nextDay ? " (next day)" : ""),
          };
        });
        setOverlapResult(localTimeResult);
        setShowTimeFields(true);

        // Fetch working hours for each participant
        const schedules = await Promise.all(
          selectedParticipantsName.map(async (participant) => {
            
            const workingHoursResponse = await fetch(
              `${API_END_POINT}/get/${participant.empId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            const workingHours = await workingHoursResponse.json();
            const startTimeConverted = convertToLocalTime(
              participant.empStartTime,
              "utc",
              creatorTimezone
            );
            console.log(startTimeConverted);
            const endTimeConverted = convertToLocalTime(
              participant.empEndTime,
              "utc",
              creatorTimezone
            );
            return {
              ...participant,
              workingHours: {
                startTime:
                  startTimeConverted.time +
                  (startTimeConverted.nextDay ? " (next day)" : ""),
                endTime:
                  endTimeConverted.time +
                  (endTimeConverted.nextDay ? " (next day)" : ""),
              },
            };
          })
        );
        setParticipantSchedules(schedules);
        console.log(participantSchedules);
        // Print participant working hours to console
        schedules.forEach((participant) => {
          console.log(
            `${participant.empName}'s working hours:`,
            participant.workingHours
          );
        });
      } else {
        console.error("Failed to find overlap");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      const response = await fetch(MEETING_API_END_POINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetId: meetingId,
          meetName: meetingName,
          meetDescription: description,
          meetDuration: duration,
          meetHostId: sessionStorage.getItem("creatorId"),
          meetDate: meetingDate,
          meetStartTime: startTime,
          meetEndTime: endTime,
          meetParticipants: selectedParticipants,
          noParticipants: selectedParticipants.length,
          meetTimeZone: sessionStorage.getItem("creatorTimezone"),
        }),
      });
      const responseParticipants = await fetch(PARTICIPANTS_API_END_POINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: meetingId,
          participantsIds: selectedParticipants,
        }),
      });
      if (response.ok && responseParticipants.ok) {
        alert("Meeting successfully scheduled!");
        // Clear the form data
        setMeetingName("");
        setDescription("");
        setDuration("");
        setMeetingDate("");
        setStartTime("");
        setEndTime("");
        setSelectedParticipants([]);
        setSelectedParticipantsName([]);
        setOverlapResult([]);
        setShowTimeFields(false);
        setMeetingId(`MEET-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      } else {
        console.error("Failed to schedule meeting");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderTimeBoxes = (workingHours, participantTimezone) => {
    const boxes = [];
    const selectedDate = DateTime.fromISO(meetingDate).setZone(creatorTimezone);
    const previousDay = selectedDate.minus({ days: 1 });
    const nextDay = selectedDate.plus({ days: 1 });

    let workingHoursFound = false;

    for (let day = 0; day < 3; day++) {
      const currentDate =
        day === 0 ? previousDay : day === 1 ? selectedDate : nextDay;
      for (let hour = 0; hour < 24; hour++) {
        const currentTime = currentDate.setZone(creatorTimezone).set({ hour })
      
        const currentTimeUTC = currentTime.toUTC().toLocaleString(DateTime.TIME_24_SIMPLE);
  
        const startTime = DateTime.fromFormat(workingHours.startTime.split(' ')[0], "HH:mm").set({ year: selectedDate.year, month: selectedDate.month, day: selectedDate.day });
        let endTime = DateTime.fromFormat(workingHours.endTime.split(' ')[0], "HH:mm").set({ year: selectedDate.year, month: selectedDate.month, day: selectedDate.day });
        
        if (endTime < startTime || workingHours.endTime.includes("(next day)")) {
          endTime = endTime.plus({ days: 1 });
        }

        const isWorkingHour =
          (currentTime >= startTime && currentTime < endTime) ||
          (currentTime.plus({ days: 1 }) >= startTime &&
            currentTime.plus({ days: 1 }) < endTime);

        if (isWorkingHour && day === 1) {
          workingHoursFound = true;
        }

        const isHovered =
          hoveredTime && hoveredTime.hasSame(currentTime, "hour");
        const participantTime = currentTime.setZone(participantTimezone);

        boxes.push(
          <div
            key={`${day}-${hour}`}
            className={`w-12 h-12 border border-sky-300 flex items-center justify-center transition-all duration-300 ${
              (isWorkingHour && day === 0) ||
              (isWorkingHour && day === 1) ||
              (isWorkingHour && day === 2)
                ? "bg-sky-500 text-white"
                : "bg-sky-100 text-sky-800"
            } ${isHovered ? "transform scale-110 z-10 shadow-lg" : ""}`}
            title={`${currentTimeUTC} ${creatorTimezone}`}
            onMouseEnter={() => setHoveredTime(currentTime)}
            onMouseLeave={() => setHoveredTime(null)}
          >
            <span className="text-[8px]">{currentTime.toFormat("HH:mm")}</span>
          </div>
        );
      }
    }
    return boxes;
  };

  const renderTimeLabels = () => {
    const labels = [];
    const selectedDate = DateTime.fromISO(meetingDate).setZone(creatorTimezone);
    const previousDay = selectedDate.minus({ days: 1 });
    const nextDay = selectedDate.plus({ days: 1 });

    for (let day = 0; day < 3; day++) {
      const currentDate =
        day === 0 ? previousDay : day === 1 ? selectedDate : nextDay;
      for (let hour = 0; hour < 24; hour++) {
        if (hour % 3 === 0) {
          labels.push(
            <div
              key={`label-${day}-${hour}`}
              className="w-12 text-xs text-center"
            >
              {hour === 0
                ? currentDate.toFormat("MMM dd")
                : `${hour.toString().padStart(2, "0")}:00`}
            </div>
          );
        } else {
          labels.push(
            <div key={`label-${day}-${hour}`} className="w-12"></div>
          );
        }
      }
    }
    return labels;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-sky-200">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-sky-800">
          Create Meeting
        </h2>
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-1">
                Meeting Name
              </label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-1">
                Meeting Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-sky-800 mb-1">
                Select Participants
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Search participants"
                className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {dropdownVisible && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-sky-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredParticipants.length === 0 ? (
                    <div className="p-2 text-sm text-sky-500">
                      No participants found
                    </div>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <div
                        key={participant.empId}
                        onClick={() => handleSelectParticipant(participant)}
                        className="p-2 hover:bg-sky-50 cursor-pointer text-sm"
                      >
                        {participant.empName} - {participant.empId}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedParticipantsName.map((participant) => (
                <div
                  key={participant.empId}
                  className="bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  <span className="mr-1">{participant.empName}</span>
                  <button
                    onClick={() => handleRemoveParticipant(participant)}
                    className="text-sky-500 hover:text-sky-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            {participantSchedules.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-sky-800">
                  Participant Schedules
                </h3>
                <p className="text-xs text-sky-600 mb-2">Date: {meetingDate}</p>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                      <div></div>
                      <div className="flex">{renderTimeLabels()}</div>
                      {participantSchedules.map((participant, index) => (
                        <React.Fragment key={index}>
                          <div className="flex flex-col justify-center">
                            <p className="font-medium text-xs text-sky-800">
                              {participant.empName}
                            </p>
                            <p className="text-xxs text-sky-600">
                              {participant.empTimezone}
                            </p>
                          </div>
                          <div className="flex">
                            {renderTimeBoxes(
                              participant.workingHours,
                              participant.empTimezone
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {console.log(overlapResult)}
            {overlapResult.length > 0 && (
              <div className="mt-4 text-sky-600 font-semibold text-sm">
                {overlapResult.map((result, index) => (
                  <div key={index} className="mb-2">
                    <p>Available Time Slot {index + 1}:</p>
                    <p className="text-xs">Start: {result.startTime}</p>
                    <p className="text-xs">End: {result.endTime}</p>
                    <p className="text-xs mt-1">Available Participants:</p>
                    <ul className="text-xs list-disc list-inside ml-2">
                      {result.availableParticipants?.map(
                        (participant, pIndex) => (
                          <li key={pIndex}>{participant}</li>
                        )
                      ) ||
                        selectedParticipantsName.map((participant, pIndex) => (
                          <li key={pIndex}>{participant.empName}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition duration-300"
            >
              Find Overlapping Interval
            </button>
            {showTimeFields && (
              <>
                <div>
                  <label className="block text-sm font-medium text-sky-800 mb-1">
                    Meeting Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-800 mb-1">
                    Meeting End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleScheduleMeeting}
                  className="w-full bg-sky-800 text-white px-4 py-2 rounded-md hover:bg-sky-900 transition duration-300"
                >
                  Schedule Meeting
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatedAlgorithmCreateMeeting;
