package com.app.milkman.component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {
    public static final String SECRET = "357638792F423F4428472B4B6250655368566D597133743677397A24432654321";
    public static final String REFRESH_SECRET = "6D597133743677397A244326543D357638792F423F4428472B4B6250655368568";
    
    // Access token valid for 30 minutes
    private static final long ACCESS_TOKEN_VALIDITY = 1000 * 60 * 30;
    
    // Refresh token valid for 7 days
    private static final long REFRESH_TOKEN_VALIDITY = 1000 * 60 * 60 * 24 * 7;

    public String extractPhoneNo(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public String extractPhoneNoFromRefreshToken(String token) {
        return extractClaimFromRefreshToken(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    public <T> T extractClaimFromRefreshToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaimsFromRefreshToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith((SecretKey) getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    private Claims extractAllClaimsFromRefreshToken(String token) {
        return Jwts
                .parser()
                .verifyWith((SecretKey) getRefreshSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    private Boolean isRefreshTokenExpired(String token) {
        Date expiration = extractClaimFromRefreshToken(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    public Boolean validateToken(String token, String phoneNumber) {
        final String phNo = extractPhoneNo(token);
        return (phNo.equals(phoneNumber) && !isTokenExpired(token));
    }
    
    public Boolean validateRefreshToken(String token, String phoneNumber) {
        final String phNo = extractPhoneNoFromRefreshToken(token);
        return (phNo.equals(phoneNumber) && !isRefreshTokenExpired(token));
    }

    public String GenerateToken(String phoneNumber) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "access");
        return createToken(claims, phoneNumber, ACCESS_TOKEN_VALIDITY);
    }
    
    public String generateRefreshToken(String phoneNumber) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createRefreshToken(claims, phoneNumber);
    }

    private String createToken(Map<String, Object> claims, String phoneNumber, long validity) {
        return Jwts.builder()
                .claims(claims)
                .subject(phoneNumber)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + validity))
                .signWith(getSignKey()).compact();
    }
    
    private String createRefreshToken(Map<String, Object> claims, String phoneNumber) {
        return Jwts.builder()
                .claims(claims)
                .subject(phoneNumber)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY))
                .signWith(getRefreshSignKey()).compact();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    private SecretKey getRefreshSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(REFRESH_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
