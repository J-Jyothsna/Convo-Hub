package com.example.meetingParticipantsService.feign;

import com.example.meetingParticipantsService.client.Meeting;
import com.example.meetingParticipantsService.dto.MeetingDateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.List;

@FeignClient(name = "meetingService", url = "http://localhost:8092/api/meetings")  // Update the URL and port as necessary
public interface MeetingClient {

    @PostMapping("/scheduled")
    ResponseEntity<List<Meeting>> getMeetingsByDateAndIds(@RequestBody MeetingDateDto meetingDateDto);

    @PostMapping("/get-meetings-by-ids")
    ResponseEntity<List<Meeting>> getMeetingsByIds(@RequestBody List<String> ids);
}

