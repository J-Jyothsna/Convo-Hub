package com.Connectify.authenticationService.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "emailService", url = "http://localhost:8095/api/emails")
public interface EmailClient {

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendEmail(@RequestParam String email, @RequestParam String otp);

}
