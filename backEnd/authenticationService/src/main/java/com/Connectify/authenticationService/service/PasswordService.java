package com.Connectify.authenticationService.service;

import com.Connectify.authenticationService.dao.UserCredentialsDao;
import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PasswordService {

    @Autowired
    private UserCredentialsDao userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean changePassword(String email, String newPassword) {
        Optional<UserCredentialsEntity> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            UserCredentialsEntity userCredentials = user.get();
            userCredentials.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(userCredentials); // Encrypt the password before saving

            return true;
        }
        return false;
    }
}

