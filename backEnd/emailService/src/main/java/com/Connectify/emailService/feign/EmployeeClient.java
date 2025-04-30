package com.Connectify.emailService.feign;

import com.Connectify.emailService.client.EmployeeEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.List;

@FeignClient(name = "employeeService", url="http://localhost:8094/api/employees")
public interface EmployeeClient {

    @PostMapping("/get-employee-by-ids")
    public ResponseEntity<List<EmployeeEntity>> getEmployeeByIds(@RequestBody List<String> ids);

    @GetMapping("/get-emp/{empId}")
    public ResponseEntity<EmployeeEntity> getEmployeeByIdForFeign(@PathVariable String empId);
}
