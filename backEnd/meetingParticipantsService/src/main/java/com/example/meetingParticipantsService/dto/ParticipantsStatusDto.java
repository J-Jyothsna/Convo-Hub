package com.example.meetingParticipantsService.dto;

public class ParticipantsStatusDto {

    String empId;
    Boolean status;

    public ParticipantsStatusDto(String empId, Boolean status) {
        this.empId = empId;
        this.status = status;
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
