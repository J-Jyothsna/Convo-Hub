package com.Connectify.authenticationService.service;

import java.time.LocalDateTime;

import com.Connectify.authenticationService.dao.OTPRepository;
import com.Connectify.authenticationService.entity.OTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OTPValidationService {

    @Autowired
    private OTPRepository otpRepository;

    public boolean validateOTP(String email, String inputOtp) {
        OTP otpRecord = otpRepository.findByEmail(email);

        if (otpRecord != null) {
            // Check if OTP matches and is not expired
            if (otpRecord.getOtp().equals(inputOtp) && otpRecord.getExpirationTime().isAfter(LocalDateTime.now())) {
                return true;
            }
        }
        return false;
    }
}
