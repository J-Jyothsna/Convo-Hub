package com.example.employeeService.dto;

import java.time.LocalTime;

public class UpdatedEmployeeDto {

    String empId;
    String empTimezone;
    LocalTime empStartTime;
    LocalTime empEndTime;

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpTimezone() {
        return empTimezone;
    }

    public void setEmpTimezone(String empTimezone) {
        this.empTimezone = empTimezone;
    }

    public LocalTime getEmpStartTime() {
        return empStartTime;
    }

    public void setEmpStartTime(LocalTime empStartTime) {
        this.empStartTime = empStartTime;
    }

    public LocalTime getEmpEndTime() {
        return empEndTime;
    }

    public void setEmpEndTime(LocalTime empEndTime) {
        this.empEndTime = empEndTime;
    }
}
