package com.example.employeeService.service;

import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.stereotype.Component;

import java.time.*;
import java.util.List;

@Component
public class LocalToUtcConvertor {

// //    public List<ZonedDateTime> convert(EmployeeEntity emp, LocalDate meetingDate){
// //        ZoneId zone = ZoneId.of(emp.getEmpTimezone());
// //
// //        // Convert LocalTime to LocalDateTime by combining with today's date and then into ZonedDateTime
// //        ZonedDateTime start = ZonedDateTime.of(LocalDateTime.of(meetingDate, emp.getEmpStartTime()), zone);
// //        ZonedDateTime end = ZonedDateTime.of(LocalDateTime.of(meetingDate, emp.getEmpEndTime()), zone);
// //
// //        //convert zonedDateTime to UTC time
// //        ZonedDateTime startUtc = start.withZoneSameInstant(ZoneOffset.UTC);
// //        ZonedDateTime endUtc = end.withZoneSameInstant(ZoneOffset.UTC);
// //
// //        return List.of(startUtc, endUtc);
// //        }
}
