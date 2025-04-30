package com.example.meetingService.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "meetingParticipants", url = "http://localhost:8093/api/participants")
public interface ParticipantsClient {

    @DeleteMapping("/delete-by-meetingId/{meetId}")
    public ResponseEntity<String> deleteByMeetId(@PathVariable String meetId, @RequestBody String reason);

    @GetMapping("/count-pending-participants/{meetId}")
    public ResponseEntity<List<String>> countPendingParticipants(@PathVariable String meetId);

}
