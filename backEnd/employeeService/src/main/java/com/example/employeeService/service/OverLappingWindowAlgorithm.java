package com.example.employeeService.service;


import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.dto.EmployeeListDto;
import com.example.employeeService.dto.Interval;
import com.example.employeeService.dto.ScheduledEmployeeDto;
import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class OverLappingWindowAlgorithm {

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private LocalToUtcConvertor localToUtcConvertor;

    public List<Interval> computeWindow(EmployeeListDto employeeListDto){
        LocalDate meetingDate = employeeListDto.getMeetingDate();
        List<EmployeeEntity> employees = employeeDao.findByEmpIdIn(employeeListDto.getListOfEmployeeId());

        return findOverlappingIntervals(employees, meetingDate);

    }

    public List<Interval> findOverlappingIntervals(List<EmployeeEntity> employees, LocalDate meetingDate) {
        List<Interval> intervals = new ArrayList<>();

        for (EmployeeEntity emp : employees) {
            // Combine the meeting date with the employee's working hours (Instant)
            // Extract the time from empStartTime and combine it with meetingDate
            ZonedDateTime meetingStartDate = meetingDate.atStartOfDay(ZoneId.of("UTC")); // Start of the meeting date in UTC

            // Convert empStartTime to LocalTime in UTC
            LocalTime empStartLocalTime = emp.getEmpStartTime().atZone(ZoneId.of("UTC")).toLocalTime();
            LocalTime empEndLocalTime = emp.getEmpEndTime().atZone(ZoneId.of("UTC")).toLocalTime();

            // Combine meetingDate with empStartLocalTime and empEndLocalTime
            Instant adjustedStart = ZonedDateTime.of(meetingDate, empStartLocalTime, ZoneId.of("UTC")).toInstant();
            Instant adjustedEnd = ZonedDateTime.of(meetingDate, empEndLocalTime, ZoneId.of("UTC")).toInstant();

            System.out.println("Employee: " + emp.getEmpName() +
                    ", Adjusted Start (UTC): " + adjustedStart + ", Adjusted End (UTC): " + adjustedEnd);

            // Handle overflow (adjust dates if needed)
            if (adjustedStart.isAfter(adjustedEnd)) {
                adjustedEnd = adjustedEnd.plusSeconds(24 * 60 * 60); // Add a day in seconds
            }


            boolean foundOverlap = false;

            for (Interval interval : intervals) {
                // Check if there is any overlap between the existing interval and the employee's working time
                System.out.println("Start Time: " + interval.getStartTime() + " End Time: " + interval.getEndTime());

                if (interval.getEndTime().isAfter(adjustedStart) &&
                       interval.getStartTime().isBefore(adjustedEnd) &&
                        !interval.getStartTime().equals(adjustedEnd) &&
                        !interval.getEndTime().equals(adjustedStart)){ // Ensure no exact overlap at the boundary

                    // Update the interval to the common overlapping period
                    interval.setStartTime(interval.getStartTime().isAfter(adjustedStart) ? interval.getStartTime() : adjustedStart);
                    interval.setEndTime(interval.getEndTime().isBefore(adjustedEnd) ? interval.getEndTime() : adjustedEnd);
                    System.out.println("Updated Interval - Start Time: " + interval.getStartTime() + " End Time: " + interval.getEndTime());

                    // Add the employee ID to this interval
                    interval.getEmployeeIds().add(new ScheduledEmployeeDto(emp.getEmpId(), emp.getEmpName(), emp.getEmpPhone(), emp.getEmpEmail()));
                    foundOverlap = true;
                    break;
                }
            }

            // If no overlapping interval was found, create a new interval
            if (!foundOverlap) {
                List<ScheduledEmployeeDto> empList = new ArrayList<>();
                empList.add(new ScheduledEmployeeDto(emp.getEmpId(), emp.getEmpName(), emp.getEmpPhone(), emp.getEmpEmail()));
                intervals.add(new Interval(adjustedStart, adjustedEnd, empList));
            }
        }

        return intervals;
    }

}




