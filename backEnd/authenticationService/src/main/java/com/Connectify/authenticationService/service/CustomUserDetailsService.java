// package com.Connectify.authenticationService.service;

// import com.Connectify.authenticationService.dao.UserCredentialsDao;
// import com.Connectify.authenticationService.entity.UserCredentialsEntity;
// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import java.util.Optional;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     @Autowired
//     UserCredentialsDao userCredentialsDao;

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         Optional<UserCredentialsEntity> user = userCredentialsDao.findByEmail(username);
//         return user.map(CustomUserDetails::new).orElseThrow(()->new UsernameNotFoundException("Username/password not valid!"));
//     }
// }

package com.Connectify.authenticationService.service;

import com.Connectify.authenticationService.dao.UserCredentialsDao;
import com.Connectify.authenticationService.entity.UserCredentialsEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserCredentialsDao userCredentialsDao;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserCredentialsEntity user = userCredentialsDao.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
