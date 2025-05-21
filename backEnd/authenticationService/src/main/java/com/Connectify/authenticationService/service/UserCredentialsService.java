// package com.Connectify.authenticationService.service;

// import com.Connectify.authenticationService.dao.UserCredentialsDao;
// import com.Connectify.authenticationService.entity.UserCredentialsEntity;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import java.util.Optional;

// @Service
// public class UserCredentialsService {

//     @Autowired
//     private JwtService jwtService;

//     @Autowired
//     UserCredentialsDao userCredentialsDao;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     public UserCredentialsEntity register(UserCredentialsEntity user){
//         user.setPassword(passwordEncoder.encode(user.getPassword()));
//         return userCredentialsDao.save(user);
//     }

//     public boolean userExists(String email) {
//         Optional<UserCredentialsEntity> user = userCredentialsDao.findByEmail(email);
//         return user.isPresent();
//     }

//     public boolean userExistsById(String id) {
//         Optional<UserCredentialsEntity> user = userCredentialsDao.findById(id);
//         return user.isPresent();
//     }

//     public String generateToken(String name){
//         return jwtService.generateToken(name);
//     }

//     public boolean verifyToken(String token){
//         return jwtService.validateToken(token);
//     }


// }

package com.Connectify.authenticationService.service;

import com.Connectify.authenticationService.dao.UserCredentialsDao;
import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import com.Connectify.authenticationService.enums.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserCredentialsService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    UserCredentialsDao userCredentialsDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserCredentialsEntity register(UserCredentialsEntity user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userCredentialsDao.save(user);
    }

    public boolean userExists(String email) {
        Optional<UserCredentialsEntity> user = userCredentialsDao.findByEmail(email);
        return user.isPresent();
    }

    public boolean userExistsById(String id) {
        Optional<UserCredentialsEntity> user = userCredentialsDao.findById(id);
        return user.isPresent();
    }

    public String generateToken(String email, String role) {
        Role roleEnum;
        try {
            roleEnum = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        return jwtService.generateToken(email, roleEnum);
    }
    

    public boolean verifyToken(String token){
        return jwtService.validateToken(token);
    }


}

