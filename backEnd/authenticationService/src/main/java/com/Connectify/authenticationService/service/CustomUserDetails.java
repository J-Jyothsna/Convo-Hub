// package com.Connectify.authenticationService.service;

// import com.Connectify.authenticationService.entity.UserCredentialsEntity;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;

// import java.util.Collection;

// public class CustomUserDetails implements UserDetails {


//     private String email;
//     private String password;


//     public CustomUserDetails(UserCredentialsEntity user) {

//         this.email = user.getEmail();
//         this.password = user.getPassword();
//     }

//     @Override
//     public Collection<? extends GrantedAuthority> getAuthorities(){
//         return null;
//     }

//     @Override
//     public String getPassword(){
//         return password;
//     }

//     @Override
//     public String getUsername(){
//         return email;
//     }
// }


package com.Connectify.authenticationService.service;

import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import com.Connectify.authenticationService.enums.Role;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private String email;
    private String password;
    private Role role;
    private UserCredentialsEntity user;

    public CustomUserDetails(UserCredentialsEntity user) {
        this.user = user;
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
    



    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}



