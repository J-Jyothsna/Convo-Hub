// package com.Connectify.authenticationService.service;

// import io.jsonwebtoken.JwtException;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.io.Decoders;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Service;

// import java.security.Key;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;

// @Service
// public class JwtService {

//     public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

//     public boolean validateToken(String token){
//         try{
//             Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
//             return true;
//         }
//         catch(JwtException ex){
//             return false;
//         }
//     }

//     public String generateToken(String userName){
//         Map<String, Object> claims = new HashMap<>();
//         return createToken(claims, userName);
//     }

//     private String createToken(Map<String, Object> claims, String userName){
//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(userName)
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(new Date(System.currentTimeMillis()+1000*60*30))
//                 .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
//     }

//     private Key getSignKey(){
//         byte[] keyBytes = Decoders.BASE64.decode(SECRET);
//         return Keys.hmacShaKeyFor(keyBytes);
//     }
// }

package com.Connectify.authenticationService.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.Connectify.authenticationService.enums.Role;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET;

    public String generateToken(String email, Role role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.name()); // Store role as string
        return createToken(claims, email);
    }
    

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public Role extractRole(String token) {
        String roleString = getClaims(token).get("role", String.class);
        return Role.valueOf(roleString); // Convert back to enum
    }
    

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
