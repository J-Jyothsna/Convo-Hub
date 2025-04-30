package com.example.meetingParticipantsService.client;

public class DeleteMeeting {

    public String empId;
    public String meetingId;
    public String reason;

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public DeleteMeeting(String empId, String meetingId, String reason) {
        this.empId = empId;
        this.meetingId = meetingId;
        this.reason = reason;
    }
}
