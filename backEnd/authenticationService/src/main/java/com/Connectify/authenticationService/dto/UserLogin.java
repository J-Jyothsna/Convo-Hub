package com.Connectify.authenticationService.dto;

import com.Connectify.authenticationService.enums.Role;

public class UserLogin {
    private String email;
    private String password;
    private Role role;

    public UserLogin(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role=role;
    }

    public UserLogin() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    

}
