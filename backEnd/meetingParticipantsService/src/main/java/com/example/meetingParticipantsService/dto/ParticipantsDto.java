package com.example.meetingParticipantsService.dto;

import java.util.List;

public class ParticipantsDto {
    private List<String> participantsIds;
    private String meetingId;
    private String hostId;

    public ParticipantsDto(List<String> participantsIds, String meetingId, String  hostId) {
        this.participantsIds = participantsIds;
        this.meetingId = meetingId;
        this.hostId = hostId;
    }

    public List<String> getParticipantsIds() {
        return participantsIds;
    }

    public void setParticipantsIds(List<String> participantsIds) {
        this.participantsIds = participantsIds;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }
}
