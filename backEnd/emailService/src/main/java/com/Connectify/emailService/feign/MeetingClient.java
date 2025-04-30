package com.Connectify.emailService.feign;

import com.Connectify.emailService.client.MeetingEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.HashMap;
import java.util.List;

@FeignClient(name = "meetingService", url = "http://localhost:8092/api/meetings")
public interface MeetingClient {

    @GetMapping("/get-by-meetId-feign/{id}")
    public ResponseEntity<MeetingEntity> getMeetingByIdForFeign(@PathVariable String id);

    @GetMapping("/find-meeting-starts-within-two-hours")
    public ResponseEntity<List<MeetingEntity>> getMeetingsStartingSoon();

}
