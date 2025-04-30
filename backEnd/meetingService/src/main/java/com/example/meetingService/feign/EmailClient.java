package com.example.meetingService.feign;

import com.example.meetingService.dto.DeleteMeetingEmail;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "emailService", url="http://localhost:8095/api/emails")
public interface EmailClient {

    @PostMapping("/send-meeting-mail")
    public ResponseEntity<String> sendMeetingMail(@RequestBody DeleteMeetingEmail deleteMeetingEmail);

}
