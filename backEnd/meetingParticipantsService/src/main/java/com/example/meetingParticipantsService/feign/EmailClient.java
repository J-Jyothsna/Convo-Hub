package com.example.meetingParticipantsService.feign;

import com.example.meetingParticipantsService.client.DeleteMeeting;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "emailService", url="http://localhost:8095/api/emails")
public interface EmailClient {

    @PostMapping("/delete-meeting")
    public ResponseEntity<String> sendCanceledMeetingMail(@RequestBody DeleteMeeting deleteMeeting);
}
