package com.example.meetingService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "meeting_details")
public class MeetingEntity {

    @Id
    String meetId;
    String meetName;
    String meetDescription;
    String meetHostId;
    String meetingDate;
    Instant meetStartDateTime;
    Instant meetEndDateTime;
    String meetDuration;
    String meetStatus;
    int meetNoOfParticipants;

    public MeetingEntity() {
    }

    public MeetingEntity(String meetId,String meetName, String meetDescription, String meetHostId, String meetingDate, Instant meetStartDateTime, Instant meetEndDateTime, String meetDuration, String meetStatus, int meetNoOfParticipants) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.meetDescription = meetDescription;
        this.meetHostId = meetHostId;
        this.meetingDate = meetingDate;
        this.meetStartDateTime = meetStartDateTime;
        this.meetEndDateTime = meetEndDateTime;
        this.meetDuration = meetDuration;
        this.meetStatus = meetStatus;
        this.meetNoOfParticipants = meetNoOfParticipants;
    }

    public String getMeetId() {
        return meetId;
    }

    public void setMeetId(String meetId) {
        this.meetId = meetId;
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

    public String getMeetDuration() {
        return meetDuration;
    }

    public void setMeetDuration(String meetDuration) {
        this.meetDuration = meetDuration;
    }

    public String getMeetStatus() {
        return meetStatus;
    }

    public void setMeetStatus(String meetStatus) {
        this.meetStatus = meetStatus;
    }

    public int getMeetNoOfParticipants() {
        return meetNoOfParticipants;
    }

    public void setMeetNoOfParticipants(int meetNoOfParticipants) {
        this.meetNoOfParticipants = meetNoOfParticipants;
    }

    public Instant getMeetStartDateTime() {
        return meetStartDateTime;
    }

    public void setMeetStartDateTime(Instant meetStartDateTime) {
        this.meetStartDateTime = meetStartDateTime;
    }

    public Instant getMeetEndDateTime() {
        return meetEndDateTime;
    }

    public void setMeetEndDateTime(Instant meetEndDateTime) {
        this.meetEndDateTime = meetEndDateTime;
    }

    public String getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(String meetingDate) {
        this.meetingDate = meetingDate;
    }
}
