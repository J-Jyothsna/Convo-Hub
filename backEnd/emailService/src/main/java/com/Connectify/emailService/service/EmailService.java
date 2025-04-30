package com.Connectify.emailService.service;

import com.Connectify.emailService.client.MeetingDto;
import com.Connectify.emailService.client.MeetingEntity;
import jakarta.mail.MessagingException;

import java.util.List;

public interface EmailService {
    public void sendEmail(String email, String otp) throws MessagingException;
    public void sendDeleteEmail(String empId, String meetingId, String reason) throws MessagingException;

    public void sendEmail(MeetingEntity meeting, List<String> participants) throws  MessagingException;

    void sendEmail(String meetHostId, String subject, String emailBody);
}
