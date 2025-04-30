package com.example.employeeService.service;

import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.dto.EmployeeListDto;
import com.example.employeeService.dto.TimeClass;
import com.example.employeeService.entity.EmployeeEntity;
import com.example.employeeService.entity.OverlapWindow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



@Service
public class OverLappingWindowClass {

//    @Autowired
//    private EmployeeDao employeeDao;
//
//    @Autowired
//    private LocalToUtcConvertor localToUtcConvertor;
//
//    public List<TimeClass> computeWindow(EmployeeListDto employeeListDto){
////        it will find the list of selected employee form the database
//        LocalDate meetingDate = employeeListDto.getMeetingDate();
//        List<EmployeeEntity> employees = employeeDao.findByEmpIdIn(employeeListDto.getListOfEmployeeId());
//
//        OverlapWindow overlap = adjustWindowDate(findOverlap(employees, meetingDate), meetingDate);
//        TimeClass greenTime = new TimeClass();
//        greenTime.setType("green");
//        greenTime.setStartTime(overlap != null ? overlap.getOverlapStart().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME):null);
//        greenTime.setEndTime(overlap != null ? overlap.getOverlapEnd().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME): null);
//
//
//
//
//        employees = extendWorkTimes(employees, 3); // Extend by ±3 hours
//        OverlapWindow overlap1 = adjustWindowDate(findOverlap(employees, meetingDate), meetingDate);
//        TimeClass amberTime = new TimeClass();
//        amberTime.setType("amber");
//        amberTime.setStartTime(overlap != null ? overlap1.getOverlapStart().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME):null);
//        amberTime.setEndTime(overlap != null ? overlap1.getOverlapEnd().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME): null);
//
//
//
//
//
//
//        List<TimeClass> result = new ArrayList<>();
//        result.add(greenTime);
//        result.add(amberTime);
//
//        return result;
//
//    }
//    public OverlapWindow adjustWindowDate(OverlapWindow overlap, LocalDate meetingDate){
//        if (overlap != null) {
//            ZonedDateTime overlapStart = adjustOverlapDateTime(overlap.getOverlapStart(), meetingDate);
//            ZonedDateTime overlapEnd = adjustOverlapDateTime(overlap.getOverlapEnd(), meetingDate);
//
//            return new OverlapWindow(overlapStart, overlapEnd);
//        } else {
//            return null; // No overlap even after extension
//        }
//    }
//
//    //logic to find the overlapping window
//    private OverlapWindow findOverlap(List<EmployeeEntity> employees, LocalDate meetingDate) {
////        ZonedDateTime maxStartTime = ZonedDateTime.of(LocalDate.now(), LocalTime.MIN, ZoneOffset.UTC);
////        ZonedDateTime minEndTime = ZonedDateTime.of(LocalDate.now(), LocalTime.MAX, ZoneOffset.UTC);
////        boolean extendsToNextDay = false;
////
////        for (EmployeeEntity emp : employees) {
////
////////            List<ZonedDateTime> zonedDateTimeList = localToUtcConvertor.convert(emp, meetingDate );
//////            ZonedDateTime startUtc = zonedDateTimeList.get(0);
//////            ZonedDateTime endUtc = zonedDateTimeList.get(1);
////
////            // Adjust maxStartTime and minEndTime based on UTC times
////            if (startUtc.isAfter(maxStartTime)) {
////                maxStartTime = startUtc;
////            }
////            if (endUtc.isBefore(minEndTime)) {
////                minEndTime = endUtc;
////            }
////
////            // Check if the window extends to the next day (if the start is after the end time)
////            if (startUtc.isAfter(endUtc)) {
////                extendsToNextDay = true;
////            }
////        }
//
//        // If there's overlap, return the result
//        if (maxStartTime.isBefore(minEndTime)) {
//            return new OverlapWindow(maxStartTime, minEndTime);
//        } else {
//            return null; // No overlap
//        }
//    }
//
//    private List<EmployeeEntity> extendWorkTimes(List<EmployeeEntity> employees, int hours) {
//        for (EmployeeEntity emp : employees) {
//            emp.setEmpStartTime(emp.getEmpStartTime().minusHours(hours));
//            emp.setEmpEndTime(emp.getEmpEndTime().plusHours(hours));
//        }
//        return employees;
//    }
//
//    private ZonedDateTime adjustOverlapDateTime(ZonedDateTime overlapDateTime, LocalDate meetingDate) {
//        // Ensure that the given ZonedDateTime corresponds to the correct meeting date (if not already)
//        ZonedDateTime dateTime = overlapDateTime.withYear(meetingDate.getYear())
//                .withMonth(meetingDate.getMonthValue())
//                .withDayOfMonth(meetingDate.getDayOfMonth());
//
//        // Check if the overlapDateTime crosses into the next or previous day
//        if (overlapDateTime.toLocalTime().isAfter(LocalTime.MAX.minusHours(3))) {
//            // Adjust date if the window crosses into the next day
//            dateTime = dateTime.plusDays(1);
//        } else if (overlapDateTime.toLocalTime().isBefore(LocalTime.MIN.plusHours(3))) {
//            // Adjust date if the window crosses into the previous day
//            dateTime = dateTime.minusDays(1);
//        }
//
//        return dateTime;
//    }



}
