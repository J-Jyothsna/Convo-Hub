package com.example.meetingService.dto;

import com.example.meetingService.entity.MeetingEntity;

import java.util.List;

public class DeleteMeetingEmail {

    MeetingEntity meeting;
    List<String> participants;

    public DeleteMeetingEmail(MeetingEntity meeting, List<String> participants) {
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
