package com.Connectify.authenticationService.service;

import com.Connectify.authenticationService.dao.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class OtpCleanupService {

    @Autowired
    private OTPRepository otpRepository;

    // This method will run every minute
    @Scheduled(fixedRate = 60000) // runs every 60 seconds
    public void removeExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();

        // Delete OTPs that have expired
        otpRepository.deleteByExpirationTimeBefore(now);


    }
}
