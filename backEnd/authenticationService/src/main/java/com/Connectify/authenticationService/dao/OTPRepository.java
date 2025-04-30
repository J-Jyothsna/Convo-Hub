package com.Connectify.authenticationService.dao;

import com.Connectify.authenticationService.entity.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;

public interface OTPRepository extends MongoRepository<OTP, Long> {
    OTP findByEmail(String email);

    void deleteByExpirationTimeBefore(LocalDateTime now);
}
