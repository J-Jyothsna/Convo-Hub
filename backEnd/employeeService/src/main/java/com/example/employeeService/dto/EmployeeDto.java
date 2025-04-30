package com.example.employeeService.dto;

import org.springframework.data.annotation.Id;

import java.time.Instant;
import java.time.LocalTime;

public class EmployeeDto {

    String empId;
    String empName;
    String empDesignation;
    String empEmail;
    String empPhone;
    String empCity;
    String empTimezone;
    LocalTime empStartTime;
    LocalTime empEndTime;

    public EmployeeDto() {
    }

    public EmployeeDto(String empId, String empName, String empDesignation, String empEmail, String empPhone, String empCity, String empTimezone, LocalTime empStartTime, LocalTime empEndTime) {
        this.empId = empId;
        this.empName = empName;
        this.empDesignation = empDesignation;
        this.empEmail = empEmail;
        this.empPhone = empPhone;
        this.empCity = empCity;
        this.empTimezone = empTimezone;
        this.empStartTime = empStartTime;
        this.empEndTime = empEndTime;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getEmpDesignation() {
        return empDesignation;
    }

    public void setEmpDesignation(String empDesignation) {
        this.empDesignation = empDesignation;
    }

    public String getEmpEmail() {
        return empEmail;
    }

    public void setEmpEmail(String empEmail) {
        this.empEmail = empEmail;
    }

    public String getEmpPhone() {
        return empPhone;
    }

    public void setEmpPhone(String empPhone) {
        this.empPhone = empPhone;
    }

    public String getEmpCity() {
        return empCity;
    }

    public void setEmpCity(String empCity) {
        this.empCity = empCity;
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
