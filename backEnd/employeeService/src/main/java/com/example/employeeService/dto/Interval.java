package com.example.employeeService.dto;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class Interval {
    Instant startTime;
    Instant endTime;
    List<ScheduledEmployeeDto> employeeIds;


    public Interval(Instant startTime, Instant endTime, List<ScheduledEmployeeDto> employeeIds) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.employeeIds = new ArrayList<>(employeeIds);
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public List<ScheduledEmployeeDto> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(List<ScheduledEmployeeDto> employeeIds) {
        this.employeeIds = employeeIds;
    }

    @Override
    public String toString() {
        return "Interval{" +
                "startTime=" + startTime +
                ", endTime=" + endTime +
                ", employeeIds=" + employeeIds +
                '}';
    }
}