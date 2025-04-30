package com.example.meetingParticipantsService.service;

import com.example.meetingParticipantsService.client.DeleteMeeting;
import com.example.meetingParticipantsService.client.Meeting;
import com.example.meetingParticipantsService.dao.ParticipantsDao;
import com.example.meetingParticipantsService.dto.MeetingDateDto;
import com.example.meetingParticipantsService.dto.ParticipantsDto;
import com.example.meetingParticipantsService.dto.ParticipantsStatusDto;
import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import com.example.meetingParticipantsService.feign.EmailClient;
import com.example.meetingParticipantsService.feign.MeetingClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ParticipantsService {

    @Autowired
    private ParticipantsDao participantsRepository;

    @Autowired
    private EmailClient emailClient;

    @Autowired
    private MeetingClient meetingClient;

    // Create a new participant
    public void createParticipant(ParticipantsDto participants) {
        int n = participants.getParticipantsIds().size();
        for(int i = 0; i < n; i++){
            ParticipantsEntity participantsEntity = new ParticipantsEntity(participants.getParticipantsIds().get(i), participants.getMeetingId(),false);
            if(participants.getParticipantsIds().get(i).equals(participants.getHostId())){
                participantsEntity.setStatus(true);
            }
            participantsRepository.save(participantsEntity);
        }
    }

    public List<Meeting> getMeetingsForParticipantOnDate(String empId, String date) {
        // Retrieve all meeting IDs associated with the participant
//        List<String> meetingIds = participantsRepository.findMeetIdByEmpId(participantId);
//        System.out.println(meetingIds.get(0));

        List<String> meetingIds = participantsRepository.findByEmpId(empId).stream()
                .map(ParticipantsEntity::getMeetId).collect(Collectors.toList());
        // Fetch meetings for the specific date and meeting IDs using Feign client
        meetingIds.forEach(meetId -> System.out.println(meetId));
        return meetingClient.getMeetingsByDateAndIds(new MeetingDateDto(date, meetingIds)).getBody();
    }
    // Get all participants
    public List<ParticipantsEntity> getAllParticipants() {
        return participantsRepository.findAll();
    }

    // Get participant by ID
    public Optional<ParticipantsEntity> getParticipantByEmpId(String id) {
        return participantsRepository.findById(id);
    }

    // Update participant
    public ParticipantsEntity updateParticipant(String id, ParticipantsEntity updatedParticipant) {
        if (participantsRepository.existsById(id)) {
            updatedParticipant.setParticipantId(id);
            return participantsRepository.save(updatedParticipant);
        } else {
            return null;
        }
    }

    // Delete participant by meetId
    public void deleteParticiantsByMeetId(String meetId, String reason) throws Exception {
        List<ParticipantsEntity> participantsEntities = participantsRepository.findByMeetId(meetId);
        if(participantsEntities.size() == 0){
            throw new Exception("No participants");
        }

        for(int i = 0; i < participantsEntities.size();i++){
            emailClient.sendCanceledMeetingMail(new DeleteMeeting(participantsEntities.get(i).getEmpId(), meetId, reason));
            participantsRepository.deleteById(participantsEntities.get(i).getParticipantId());
        }
    }


    public List<ParticipantsStatusDto> getParticipantsStatus(String meetId) {
        List<ParticipantsStatusDto> participantsStatusDtoList = participantsRepository.findByMeetId(meetId).stream()
                .map(participantsEntity -> new ParticipantsStatusDto(participantsEntity.getEmpId(), participantsEntity.getStatus()))
                .collect(Collectors.toList());

        return participantsStatusDtoList;
    }

    public ParticipantsEntity updateParticipantStatus(String empId, String meetId) {
        ParticipantsEntity participantsEntity = participantsRepository.findByEmpIdAndMeetId(empId, meetId);
        participantsEntity.setStatus(true);
        System.out.println(participantsEntity.getStatus());
        return participantsRepository.save(participantsEntity);
    }

    public List<Meeting> getMeetingsForParticipant(String participantId) {
        System.out.println(participantId);
        List<String> meetingIds = participantsRepository.findByEmpId(participantId).stream()
                .map(ParticipantsEntity::getMeetId).collect(Collectors.toList());

        return meetingClient.getMeetingsByIds(meetingIds).getBody();
    }

    public List<String> countPendingParticipants(String meetId) {
        return participantsRepository.findByMeetId(meetId).stream()
                .filter(participantsEntity -> participantsEntity.getStatus() == false)
                .map(ParticipantsEntity::getEmpId)
                .collect(Collectors.toList());
    }
}

