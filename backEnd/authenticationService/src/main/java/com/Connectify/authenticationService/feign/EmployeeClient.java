package com.Connectify.authenticationService.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.HashMap;

@FeignClient(name = "employeeService", url = "http://localhost:8094/api/employees")
public interface EmployeeClient {

    @GetMapping("/get/{empId}")
    ResponseEntity<HashMap<String, Object>> getEmployeeById(@PathVariable String empId);
}
