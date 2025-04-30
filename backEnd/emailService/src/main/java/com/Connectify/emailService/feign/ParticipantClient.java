package com.Connectify.emailService.feign;

import com.Connectify.emailService.client.ParticipantEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "meetingParticipantsService", url = "http://localhost:8093/api/participants")
public interface ParticipantClient {
    @GetMapping("/count-pending-participants/{meetId}")
    public ResponseEntity<List<String>> countPendingParticipants(@PathVariable String meetId);
}
