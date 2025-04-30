package com.Connectify.emailService.controller;


import com.Connectify.emailService.client.DeleteMeeting;
import com.Connectify.emailService.client.DeleteMeetingMail;

import com.Connectify.emailService.service.EmailServiceImpl;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailServiceImpl emailService;

    @PostMapping("/send-otp")
    private ResponseEntity<String> sendEmail(@RequestParam String email, @RequestParam String otp) {
        try{
            emailService.sendEmail(email, otp);
        } catch (MessagingException e) {
           return new ResponseEntity<>("Can't send the OTP right now", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>("Otp sent successfully", HttpStatus.OK);
    }

    @PostMapping("/send-meeting-mail")
    public ResponseEntity<String> sendMeetingMail(@RequestBody DeleteMeetingMail deleteMeetingMail){
        try{

            emailService.sendEmail(deleteMeetingMail.getMeeting(), deleteMeetingMail.getParticipants());

        } catch (MessagingException e) {
            return new ResponseEntity<>("error in sending mail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
    }

    @PostMapping("/delete-meeting")
    public ResponseEntity<String> sendCanceledMeetingMail(@RequestBody DeleteMeeting deleteMeeting){
        try{

            emailService.sendDeleteEmail(deleteMeeting.empId, deleteMeeting.meetingId, deleteMeeting.reason);
        }
        catch(MessagingException e){
            return new ResponseEntity<>("error in sending mail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Email sent Successfully", HttpStatus.OK);
    }

}
