package com.example.employeeService.dto;

import java.time.LocalDate;
import java.util.List;

public class EmployeeListDto {

    private LocalDate meetingDate;
    private List<String> listOfEmployeeId;

    public EmployeeListDto(LocalDate meetingDate, List<String> listOfEmployeeId) {
        this.meetingDate = meetingDate;
        this.listOfEmployeeId = listOfEmployeeId;
    }

    public LocalDate getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public List<String> getListOfEmployeeId() {
        return listOfEmployeeId;
    }

    public void setListOfEmployeeId(List<String> listOfEmployeeId) {
        this.listOfEmployeeId = listOfEmployeeId;
    }
}
