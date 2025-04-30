package com.Connectify.emailService.client;

import java.util.List;

public class DeleteMeetingMail {

    MeetingEntity meeting;
    List<String> participants;

    public DeleteMeetingMail(MeetingEntity meeting, List<String> participants) {
        this.meeting = meeting;
        this.participants = participants;
    }

    public MeetingEntity getMeeting() {
        return meeting;
    }

    public void setMeeting(MeetingEntity meeting) {
        this.meeting = meeting;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }
}
