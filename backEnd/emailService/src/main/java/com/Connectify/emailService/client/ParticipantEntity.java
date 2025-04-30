package com.Connectify.emailService.client;

public class ParticipantEntity {

    String participantId;
    String meetId;
    String empId;
    Boolean status;

    public ParticipantEntity() {
    }

    public ParticipantEntity(String participantId, String meetId, String empId, Boolean status) {
        this.participantId = participantId;
        this.meetId = meetId;
        this.empId = empId;
        this.status = status;
    }

    public ParticipantEntity(String empId, String meetId,  Boolean status) {

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
