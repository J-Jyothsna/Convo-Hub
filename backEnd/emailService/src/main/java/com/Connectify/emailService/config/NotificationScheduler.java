package com.Connectify.emailService.config;

import com.Connectify.emailService.service.MeetingCoordinatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {
    @Autowired
    private MeetingCoordinatorService coordinatorService;

    @Scheduled(fixedRate = 60000) // Every 15 minutes
    public void scheduleParticipantNotification() {
        System.out.println("participants schedule");
        coordinatorService.notifyHostAboutUnconfirmedParticipants();
    }
}