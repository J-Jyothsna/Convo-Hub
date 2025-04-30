package com.example.meetingService.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class MeetingDto {

    String meetId;
    String meetName;
    String meetDescription;
    String meetHostId;
    LocalTime meetStartTime;
    LocalTime meetEndTime;
    String meetDate;
    String meetDuration;
    String meetTimeZone;

    int noParticipants;
    private List<String> meetParticipants;

    public MeetingDto() {
    }

    public MeetingDto(String meetId, String meetName, String meetDescription, String meetHostId, LocalTime meetStartTime, LocalTime meetEndTime, String meetDate, String meetDuration, List<String> meetParticipants, int noParticipants, String meetTimeZone) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.meetDescription = meetDescription;
        this.meetHostId = meetHostId;
        this.meetStartTime = meetStartTime;
        this.meetEndTime = meetEndTime;
        this.meetDate = meetDate;
        this.meetDuration = meetDuration;
        this.noParticipants = noParticipants;
        this.meetParticipants = meetParticipants;
        this.meetTimeZone = meetTimeZone;

    }

    public String getMeetId() {
        return meetId;
    }

    public void setMeetId(String meetId) {
        this.meetId = meetId;
    }

    public int getNoParticipants() {
        return noParticipants;
    }

    public void setNoParticipants(int noParticipants) {
        this.noParticipants = noParticipants;
    }

    public String getMeetName() {
        return meetName;
    }

    public void setMeetName(String meetName) {
        this.meetName = meetName;
    }

    public String getMeetDescription() {
        return meetDescription;
    }

    public void setMeetDescription(String meetDescription) {
        this.meetDescription = meetDescription;
    }

    public String getMeetHostId() {
        return meetHostId;
    }

    public void setMeetHostId(String meetHostId) {
        this.meetHostId = meetHostId;
    }

    public LocalTime getMeetEndTime() {
        return meetEndTime;
    }

    public void setMeetEndTime(LocalTime meetEndTime) {
        this.meetEndTime = meetEndTime;
    }

    public LocalTime getMeetStartTime() {
        return meetStartTime;
    }

    public void setMeetStartTime(LocalTime meetStartTime) {
        this.meetStartTime = meetStartTime;
    }

    public String getMeetDate() {
        return meetDate;
    }

    public void setMeetDate(String meetDate) {
        this.meetDate = meetDate;
    }

    public String getMeetDuration() {
        return meetDuration;
    }

    public void setMeetDuration(String meetDuration) {
        this.meetDuration = meetDuration;
    }

    public List<String> getMeetParticipants() {
        return meetParticipants;
    }

    public void setMeetParticipants(List<String> meetParticipants) {
        this.meetParticipants = meetParticipants;
    }

    public String getMeetTimeZone() {
        return meetTimeZone;
    }

    public void setMeetTimeZone(String meetTimeZone) {
        this.meetTimeZone = meetTimeZone;
    }

}
