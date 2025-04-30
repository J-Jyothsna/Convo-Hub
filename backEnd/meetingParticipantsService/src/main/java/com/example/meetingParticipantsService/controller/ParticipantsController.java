package com.example.meetingParticipantsService.controller;

import com.example.meetingParticipantsService.client.Meeting;
import com.example.meetingParticipantsService.dto.ParticipantsDto;
import com.example.meetingParticipantsService.dto.ParticipantsStatusDto;
import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import com.example.meetingParticipantsService.service.ParticipantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/participants")
public class ParticipantsController {

    @Autowired
    private ParticipantsService participantsService;

    // Create a new participant
    @PostMapping("/add")
    public ResponseEntity<HashMap<String, Object>> createParticipant(@RequestBody ParticipantsDto participants) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            participantsService.createParticipant(participants);
            response.put("message", "Participant added successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            response.put("message", "Error adding participant");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all participants
    @GetMapping("/getAll")
    public ResponseEntity<HashMap<String, Object>> getAllParticipants() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            List<ParticipantsEntity> participants = participantsService.getAllParticipants();
            response.put("message", "Participants fetched successfully");
            response.put("participants", participants);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("message", "Error fetching participants");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{empId}/meetings")
    public ResponseEntity<Map<String, Object>> getMeetingsForParticipantOnDate(
            @PathVariable String empId,
            @RequestParam String date) {

        Map<String, Object> response = new HashMap<>();
        List<Meeting> meetings = participantsService.getMeetingsForParticipantOnDate(empId, date);
        if (meetings == null) {
            response.put("message", "No meeting scheduled for that date");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("meetings", meetings);
        response.put("message", "the meeting of the day");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{participantId}/meetings-of-id")
    public ResponseEntity<Map<String, Object>> getMeetingsForParticipantOnDate(@PathVariable String participantId) {

        System.out.println(participantId);
        Map<String, Object> response = new HashMap<>();
        List<Meeting> meetings = participantsService.getMeetingsForParticipant(participantId);
        if (meetings == null) {
            response.put("message", "No meeting scheduled for that date");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("meetings", meetings);
        response.put("message", "the meeting of the day");
        return ResponseEntity.ok(response);
    }


//    it is used to get the list of participants of a specific meeting id with their status
    @GetMapping("/meeting-participants-details/{meetId}")
    public ResponseEntity<List<ParticipantsStatusDto>> getParticipantsStatus(@PathVariable String meetId){
        return new ResponseEntity<>(participantsService.getParticipantsStatus(meetId), HttpStatus.OK);
    }

//    update the status of the meeting of particular person
    @PutMapping("/update-status/{empId}/{meetId}")
    public ResponseEntity<ParticipantsEntity> updateMeetingStatus(@PathVariable String empId, @PathVariable String meetId){
        return new ResponseEntity<>(participantsService.updateParticipantStatus(empId, meetId), HttpStatus.OK);
    }


    // Get participant by ID
    @GetMapping("/get/{empId}")
    public ResponseEntity<HashMap<String, Object>> getParticipantByEmpId(@PathVariable String id) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<ParticipantsEntity> participant = participantsService.getParticipantByEmpId(id);
            if (participant.isPresent()) {
                response.put("message", "Participant found");
                response.put("participant", participant.get());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Participant not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error fetching participant");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete-by-meetingId/{meetId}")
    public ResponseEntity<String> deleteByMeetId(@PathVariable String meetId, @RequestBody String reason){
        try{
            participantsService.deleteParticiantsByMeetId(meetId, reason);
            return new ResponseEntity<>("delete success", HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>("Deletion failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/count-pending-participants/{meetId}")
    public ResponseEntity<List<String>> countPendingParticipants(@PathVariable String meetId){
        return new ResponseEntity<>(participantsService.countPendingParticipants(meetId), HttpStatus.OK);
    }


}
