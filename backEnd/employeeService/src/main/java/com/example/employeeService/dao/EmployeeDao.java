package com.example.employeeService.dao;

import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeDao extends MongoRepository<EmployeeEntity, String> {
    Optional<EmployeeEntity> findByEmpEmail(String email);

    List<EmployeeEntity> findByEmpIdIn(List<String> employeesId);
}
