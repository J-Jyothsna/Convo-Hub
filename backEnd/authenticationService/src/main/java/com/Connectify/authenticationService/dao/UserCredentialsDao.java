package com.Connectify.authenticationService.dao;

import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialsDao extends MongoRepository<UserCredentialsEntity, String> {
    Optional<UserCredentialsEntity> findByEmail(String email);
}
