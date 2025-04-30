package com.Connectify.emailService.service;

import com.Connectify.emailService.client.EmployeeEntity;
import com.Connectify.emailService.client.MeetingEntity;
import com.Connectify.emailService.client.ParticipantEntity;
import com.Connectify.emailService.feign.EmployeeClient;
import com.Connectify.emailService.feign.MeetingClient;
import com.Connectify.emailService.feign.ParticipantClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;

@Service
public class MeetingCoordinatorService {
    @Autowired
    private MeetingClient meetingService;

    @Autowired
    private ParticipantClient participantsService;

    @Autowired
    private EmployeeClient employeeClient;

    @Autowired
    private EmailService emailService;

    public void notifyHostAboutUnconfirmedParticipants() {
        List<MeetingEntity> upcomingMeetings = meetingService.getMeetingsStartingSoon().getBody();

        if(upcomingMeetings != null) {
            for (MeetingEntity meeting : upcomingMeetings) {
                EmployeeEntity host = employeeClient.getEmployeeByIdForFeign(meeting.getMeetHostId()).getBody();
                List<String> unconfirmedParticipants =
                        participantsService.countPendingParticipants(meeting.getMeetId()).getBody();

                List<EmployeeEntity> participants = employeeClient.getEmployeeByIds(unconfirmedParticipants).getBody();
                if (!participants.isEmpty()) {
                    String participantNames = participants.stream()
                            .map(EmployeeEntity::getEmpName)
                            .reduce((a, b) -> a + "/n" + b)
                            .orElse("No participants");

                    String emailBody = String.format(
                            "The following participants have not confirmed their attendance for the meeting '%s' starting at %s: %s ",
                            meeting.getMeetName(),
                            meeting.getMeetStartDateTime().atZone(ZoneId.of(host.getEmpTimezone())),
                            participantNames
                    );

                    emailService.sendEmail(meeting.getMeetHostId(), "Unconfirmed Participants Alert", emailBody);
                }
            }
        }
    }
}
