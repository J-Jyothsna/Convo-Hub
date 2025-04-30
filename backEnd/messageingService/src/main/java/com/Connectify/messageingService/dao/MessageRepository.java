package com.Connectify.messageingService.dao;

import com.Connectify.messageingService.Entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByReceiverIdAndIsReadFalse(String receiverId);

    List<Message> findBysenderIdAndIsReadFalse(String senderId);
}
