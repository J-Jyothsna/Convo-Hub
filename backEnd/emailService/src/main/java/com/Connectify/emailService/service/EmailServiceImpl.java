package com.Connectify.emailService.service;

import com.Connectify.emailService.client.EmployeeEntity;
import com.Connectify.emailService.client.MeetingDto;
import com.Connectify.emailService.client.MeetingEntity;
import com.Connectify.emailService.feign.EmployeeClient;
import com.Connectify.emailService.feign.MeetingClient;
import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {


    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmployeeClient employeeClient;

    @Autowired
    private MeetingClient meetingClient;

    @Override
    public void sendEmail(String toEmail, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("jyothsnaj212@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("Your OTP for Password Reset");
        helper.setText("Your OTP is: " + otp);

        mailSender.send(message);
    }

    @Override
    public void sendDeleteEmail(String empId, String meetingId, String reason) throws MessagingException {
        EmployeeEntity employeeEntity =  employeeClient.getEmployeeByIdForFeign(empId).getBody();
        MeetingEntity meetingDto =  meetingClient.getMeetingByIdForFeign(meetingId).getBody();
        EmployeeEntity host = employeeClient.getEmployeeByIdForFeign(meetingDto.getMeetHostId()).getBody();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(host.getEmpEmail());
            helper.setTo(employeeEntity.getEmpEmail());
            helper.setSubject(meetingDto.getMeetName());
            helper.setText(reason);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void sendEmail(MeetingEntity meeting, List<String> participants) throws MessagingException {


        EmployeeEntity host = employeeClient.getEmployeeByIdForFeign(meeting.getMeetHostId()).getBody();
        employeeClient.getEmployeeByIds(participants).getBody().forEach((participant)->{
            try {
                String startTime = meeting.getMeetStartDateTime().atZone(ZoneId.of(participant.getEmpTimezone())).format(DateTimeFormatter.ISO_DATE);
                String endTime = meeting.getMeetEndDateTime().atZone(ZoneId.of(participant.getEmpTimezone())).format(DateTimeFormatter.ISO_DATE);
                String information = "The meeting  " + meeting.getMeetName() + " scheduled on " + meeting.getMeetingDate() + " on the start time" + startTime+ " ends at " + endTime;
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setFrom(host.getEmpEmail());
                helper.setTo(participant.getEmpEmail());
                helper.setSubject(meeting.getMeetName());
                helper.setText(information);
                mailSender.send(message);
            } catch (MessagingException e) {
                // System.err.println("errored");
                throw new RuntimeException(e);
            }

    //     @Override
    // public void sendEmail(MeetingEntity meeting, List<String> participants) throws MessagingException {
    //     if (participants == null || participants.isEmpty()) {
    //         throw new IllegalArgumentException("Participant list is null or empty");
    //     }
    
    //     EmployeeEntity host = employeeClient.getEmployeeByIdForFeign(meeting.getMeetHostId()).getBody();
    //     List<EmployeeEntity> participantList = employeeClient.getEmployeeByIds(participants).getBody();
    
    //     if (participantList == null) {
    //         throw new IllegalArgumentException("Could not retrieve employee details for participants");
    //     }
    
    //     participantList.forEach(participant -> {
    //         try {
    //             String startTime = meeting.getMeetStartDateTime().atZone(ZoneId.of(participant.getEmpTimezone())).format(DateTimeFormatter.ISO_DATE);
    //             String endTime = meeting.getMeetEndDateTime().atZone(ZoneId.of(participant.getEmpTimezone())).format(DateTimeFormatter.ISO_DATE);
    //             String information = "The meeting  " + meeting.getMeetName() + " scheduled on " + meeting.getMeetingDate() + " on the start time " + startTime + " ends at " + endTime;
    
    //             MimeMessage message = mailSender.createMimeMessage();
    //             MimeMessageHelper helper = new MimeMessageHelper(message, true);
    //             helper.setFrom(host.getEmpEmail());
    //             helper.setTo(participant.getEmpEmail());
    //             helper.setSubject(meeting.getMeetName());
    //             helper.setText(information);
    //             mailSender.send(message);
    //         } catch (MessagingException e) {
    //             throw new RuntimeException(e);
    //         }
    //     });
    // }
    
        });

    };

    

    @Override
    public void sendEmail(String meetHostId, String subject, String emailBody) {
        EmployeeEntity host = employeeClient.getEmployeeByIdForFeign(meetHostId).getBody();
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("jyothsnaj212@gmail.com");
            helper.setTo(host.getEmpEmail());
            helper.setSubject(subject);
            helper.setText(emailBody);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }
}


