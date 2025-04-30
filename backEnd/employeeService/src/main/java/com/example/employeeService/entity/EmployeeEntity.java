package com.example.employeeService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "employee_details")
public class EmployeeEntity {

    @Id
    String empId;
    String empName;
    String empDesignation;
    String empEmail;
    String empPhone;
    String empCity;
    String empTimezone;
    Instant empStartTime;
    Instant empEndTime;
    Boolean profileStatus;

    public Boolean getProfileStatus() {
        return profileStatus;
    }

    public void setProfileStatus(Boolean profileStatus) {
        this.profileStatus = profileStatus;
    }

    public EmployeeEntity() {
    }

    public EmployeeEntity(String empId, String empName, String empDesignation, String empEmail, String empPhone, String empCity, String empTimezone, Instant empStartTime, Instant empEndTime, Boolean profileStatus) {
        this.empId = empId;
        this.empName = empName;
        this.empDesignation = empDesignation;
        this.empEmail = empEmail;
        this.empPhone = empPhone;
        this.empCity = empCity;
        this.empTimezone = empTimezone;
        this.empStartTime = empStartTime;
        this.empEndTime = empEndTime;
        this.profileStatus = profileStatus;
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

    public Instant getEmpStartTime() {
        return empStartTime;
    }

    public void setEmpStartTime(Instant empStartTime) {
        this.empStartTime = empStartTime;
    }

    public Instant getEmpEndTime() {
        return empEndTime;
    }

    public void setEmpEndTime(Instant empEndTime) {
        this.empEndTime = empEndTime;
    }
}
