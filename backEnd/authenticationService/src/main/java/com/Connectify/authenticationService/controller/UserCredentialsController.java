package com.Connectify.authenticationService.controller;

import com.Connectify.authenticationService.dto.UserLogin;
import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import com.Connectify.authenticationService.feign.EmployeeClient;
import com.Connectify.authenticationService.service.OTPService;
import com.Connectify.authenticationService.service.OTPValidationService;
import com.Connectify.authenticationService.service.PasswordService;
import com.Connectify.authenticationService.service.UserCredentialsService;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class UserCredentialsController {

    @Autowired
    private UserCredentialsService userCredService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OTPService otpService;

    @Autowired
    private OTPValidationService otpValidationService;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private EmployeeClient employeeClient;

    @GetMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestParam String email) {
        try {
            String message = otpService.generateAndSendOTP(email);
            System.out.println(message);

            Map<String, String> response = new HashMap<>();
            response.put("message", message);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (FeignException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Problem in backend! Try again later.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/validate-otp")
    public ResponseEntity<Map<String, String>> validateOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpValidationService.validateOTP(email, otp);
        Map<String, String> response = new HashMap<>();
        if (isValid) {
            response.put("message", "OTP is valid");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "OTP is invalid");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestParam String email, @RequestParam String newPassword) {

        passwordService.changePassword(email, newPassword);
        Map<String, String> response = new HashMap<>();
        response.put("message",  "Password changed successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);


    }

    @GetMapping("/get-user/{email}")
    public ResponseEntity<Map<String, String>> getUser(@PathVariable String email){

        Map<String, String> response = new HashMap<>();
        if(userCredService.userExists(email)){
            response.put("message", "User exists");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            response.put("message", "User doesn't exists");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserCredentialsEntity user) {
        Map<String, Object> response = new HashMap<>();
        try {

            if (userCredService.userExists(user.getEmail()) || userCredService.userExistsById(user.getId())) {
                response.put("message", "User already exists go to sign in project");

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // if (!employeeClient.getEmployeeById(user.getId()).getStatusCode().equals(HttpStatus.OK)) {
            //     System.out.println(user.getId());
            //     response.put("message", "Employee ID does not exist");
            //     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            // }

            UserCredentialsEntity createdUser = userCredService.register(user);
            response.put("data", user);
            response.put("message", "User registered successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        // catch(FeignException.NotFound e){
        //     response.put("message", "Employee Id doesn't exists");
        //     return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        // }
        catch(FeignException e){
            response.put("message", "Failed to fetch employee details, (may be backend is down");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        catch (Exception e) {
            response.put("message", e.getMessage());
//            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/validate/token")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = userCredService.verifyToken(token);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserLogin user) {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
            if (authentication.isAuthenticated()) {
                String token = userCredService.generateToken(user.getEmail());
                response.put("message", "Login successful");
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("message",e.getMessage()) ;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
