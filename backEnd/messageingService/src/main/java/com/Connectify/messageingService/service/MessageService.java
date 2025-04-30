package com.Connectify.messageingService.service;

import com.Connectify.messageingService.Entity.Message;
import com.Connectify.messageingService.dao.MessageRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String QUEUE_NAME = "chatQueue";

    public List<Message> getUnreadMessages(String senderId) {
        return messageRepository.findBysenderIdAndIsReadFalse(senderId);
    }

    public Message sendMessage(String senderId, ZoneId zoneId, String receiverId, String content) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setTimestamp(ZonedDateTime.now(zoneId).toInstant());
        message.setRead(false);

        messageRepository.save(message);
        System.out.println(message.getContent());
        rabbitTemplate.convertAndSend(QUEUE_NAME, message);
        return message;
    }

    public void markMessagesAsRead(List<Message> messages) {
        messages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(messages);
    }
}
