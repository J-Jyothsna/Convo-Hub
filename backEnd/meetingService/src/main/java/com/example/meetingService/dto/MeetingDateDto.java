package com.example.meetingService.dto;

import java.util.List;

public class MeetingDateDto {

    String date;
    List<String> ids;

    public MeetingDateDto(String date, List<String> ids) {
        this.date = date;
        this.ids = ids;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<String> getIds() {
        return ids;
    }

    public void setIds(List<String> ids) {
        this.ids = ids;
    }
}
