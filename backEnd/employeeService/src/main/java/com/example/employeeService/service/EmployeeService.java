package com.example.employeeService.service;

import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.dto.EmployeeDto;
import com.example.employeeService.dto.UpdatedEmployeeDto;
import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao employeeDao;

    // Create a new employee
    public EmployeeEntity createEmployee(EmployeeDto employeeDto) {
        EmployeeEntity employee = new EmployeeEntity();
        employee.setEmpId(employeeDto.getEmpId());
        employee.setEmpCity(employeeDto.getEmpCity());
        employee.setEmpDesignation(employeeDto.getEmpDesignation());
        employee.setEmpEmail(employeeDto.getEmpEmail());
        employee.setEmpName(employeeDto.getEmpName());
        employee.setEmpPhone(employeeDto.getEmpPhone());
        employee.setProfileStatus(false);

        return employeeDao.save(employee);
    }

    // Get all employees
    public List<EmployeeEntity> getAllEmployees() {
        return employeeDao.findAll();
    }

    // Get employee by ID
    public Optional<EmployeeEntity> getEmployeeById(String empId) {
        return employeeDao.findById(empId);
    }

    // Update an employee
    public EmployeeEntity updateEmployee(String empId, EmployeeEntity updatedEmployee) {
        Optional<EmployeeEntity> existingEmployee = employeeDao.findById(empId);
        if (existingEmployee.isPresent()) {
            EmployeeEntity employee = existingEmployee.get();
            // Update fields
            employee.setEmpName(updatedEmployee.getEmpName());
            employee.setEmpDesignation(updatedEmployee.getEmpDesignation());
            employee.setEmpEmail(updatedEmployee.getEmpEmail());
            employee.setEmpPhone(updatedEmployee.getEmpPhone());
            employee.setEmpCity(updatedEmployee.getEmpCity());
            employee.setEmpTimezone(updatedEmployee.getEmpTimezone());
            employee.setEmpStartTime(updatedEmployee.getEmpStartTime());
            employee.setEmpEndTime(updatedEmployee.getEmpEndTime());
            return employeeDao.save(employee);
        }
        return null;
    }



    // Delete an employee by ID
    public void deleteEmployee(String empId) {
        employeeDao.deleteById(empId);
    }

    public Optional<EmployeeEntity> getEmployeeByEmail(String email) {
        return employeeDao.findByEmpEmail(email);
    }


    public List<EmployeeEntity> getAllEmployeesByIds(List<String> ids) {
        return employeeDao.findByEmpIdIn(ids);
    }

    public void updateStatus(UpdatedEmployeeDto updatedEmployeeDto) {
        Optional<EmployeeEntity> employeeEntity = getEmployeeById(updatedEmployeeDto.getEmpId());
        EmployeeEntity employee = employeeEntity.get();
        employee.setEmpTimezone(updatedEmployeeDto.getEmpTimezone());


        ZonedDateTime startDateTime = ZonedDateTime.of(LocalDate.now(), updatedEmployeeDto.getEmpStartTime(), ZoneId.of(updatedEmployeeDto.getEmpTimezone()) );
        employee.setEmpStartTime(startDateTime.toInstant());

        ZonedDateTime endDateTime = ZonedDateTime.of(LocalDate.now(), updatedEmployeeDto.getEmpEndTime(), ZoneId.of(updatedEmployeeDto.getEmpTimezone()) );
        employee.setEmpEndTime(endDateTime.toInstant());

        employee.setProfileStatus(true);
        employeeDao.save(employee);
    }
}

