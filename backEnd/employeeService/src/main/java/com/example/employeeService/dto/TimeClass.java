package com.example.employeeService.dto;

import java.time.LocalDateTime;

public class TimeClass {
    private String type;
    private String startTime;
    private String endTime;

    public TimeClass() {
    }

    public TimeClass(String type, String startTime, String endTime) {
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
