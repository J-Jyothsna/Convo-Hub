package com.example.meetingParticipantsService.client;

import java.time.LocalDateTime;

public class Meeting {

    String meetId;
    String meetName;
    String meetDescription;
    String meetHostId;
    String meetingDate;
    LocalDateTime meetStartDateTime;
    LocalDateTime meetEndDateTime;
    String meetDuration;
    String meetStatus;
    int meetNoOfParticipants;


    public String getMeetId() {
        return meetId;
    }

    public void setMeetId(String meetId) {
        this.meetId = meetId;
    }

    public int getMeetNoOfParticipants() {
        return meetNoOfParticipants;
    }

    public void setMeetNoOfParticipants(int meetNoOfParticipants) {
        this.meetNoOfParticipants = meetNoOfParticipants;
    }

    public String getMeetStatus() {
        return meetStatus;
    }

    public void setMeetStatus(String meetStatus) {
        this.meetStatus = meetStatus;
    }

    public LocalDateTime getMeetEndDateTime() {
        return meetEndDateTime;
    }

    public void setMeetEndDateTime(LocalDateTime meetEndDateTime) {
        this.meetEndDateTime = meetEndDateTime;
    }

    public LocalDateTime getMeetStartDateTime() {
        return meetStartDateTime;
    }

    public void setMeetStartDateTime(LocalDateTime meetStartDateTime) {
        this.meetStartDateTime = meetStartDateTime;
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

    public String getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(String meetingDate) {
        this.meetingDate = meetingDate;
    }

    public String getMeetDuration() {
        return meetDuration;
    }

    public void setMeetDuration(String meetDuration) {
        this.meetDuration = meetDuration;
    }
}
