package com.example.meetingService.config;

import com.example.meetingService.dao.MeetingDao;
import com.example.meetingService.entity.MeetingEntity;
import com.example.meetingService.service.MeetingCleanUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MeetingCleanUpSchedular {

    @Autowired
    private MeetingCleanUpService meetingCleanUpService;

    // Schedule the cleanup to run daily at midnight
//    @Scheduled(cron = "0 0 0 * * ?")
    @Scheduled(fixedRate = 60000)
    public void scheduleMeetingCleanup() {
        meetingCleanUpService.removeOldMeetings();
    }



}
