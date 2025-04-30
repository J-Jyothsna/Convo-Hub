package com.example.meetingService.service;

import com.example.meetingService.dao.MeetingDao;
import com.example.meetingService.feign.ParticipantsClient;
import jakarta.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class MeetingCleanUpService {

    @Autowired
    private MeetingDao meetingRepository;

    @Autowired
    private ParticipantsClient participantsClient;

    public void removeOldMeetings() {
        // Calculate the cutoff Instant (1 week ago)
        Instant cutoffTime = Instant.now().minus(Duration.ofDays(7));

        // Delete meetings older than the cutoff time
        meetingRepository.deleteByMeetStartDateTimeBefore(cutoffTime);
    }


}
