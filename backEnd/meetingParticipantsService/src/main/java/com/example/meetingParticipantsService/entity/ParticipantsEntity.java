package com.example.meetingParticipantsService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "meeting_participants_details")
public class ParticipantsEntity {
    @Id
    String participantId;
    String meetId;
    String empId;
    Boolean status;

    public ParticipantsEntity() {
    }

    public ParticipantsEntity(String participantId, String meetId, String empId, Boolean status) {
        this.participantId = participantId;
        this.meetId = meetId;
        this.empId = empId;
        this.status = status;
    }

    public ParticipantsEntity(String empId, String meetId,  Boolean status) {

        this.meetId = meetId;
        this.empId = empId;
        this.status = status;
    }

    public String getParticipantId() {
        return participantId;
    }

    public void setParticipantId(String participantId) {
        this.participantId = participantId;
    }

    public String getMeetId() {
        return meetId;
    }

    public void setMeetId(String meetId) {
        this.meetId = meetId;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
