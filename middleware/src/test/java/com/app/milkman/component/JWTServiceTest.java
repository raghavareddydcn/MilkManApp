package com.app.milkman.component;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JWT Service Tests")
class JWTServiceTest {

    private JWTService jwtService;
    private final String testPhoneNumber = "9876543210";

    @BeforeEach
    void setUp() {
        jwtService = new JWTService();
    }

    @Test
    @DisplayName("Should generate valid JWT token")
    void testGenerateToken() {
        String token = jwtService.GenerateToken(testPhoneNumber);

        assertNotNull(token, "Token should not be null");
        assertFalse(token.isEmpty(), "Token should not be empty");
        assertTrue(token.split("\\.").length == 3, "JWT should have 3 parts separated by dots");
    }

    @Test
    @DisplayName("Should extract phone number from token")
    void testExtractPhoneNo() {
        String token = jwtService.GenerateToken(testPhoneNumber);
        String extractedPhoneNo = jwtService.extractPhoneNo(token);

        assertEquals(testPhoneNumber, extractedPhoneNo, "Extracted phone number should match");
    }

    @Test
    @DisplayName("Should validate correct token")
    void testValidateToken() {
        String token = jwtService.GenerateToken(testPhoneNumber);
        Boolean isValid = jwtService.validateToken(token, testPhoneNumber);

        assertTrue(isValid, "Token should be valid for the correct phone number");
    }

    @Test
    @DisplayName("Should reject token with wrong phone number")
    void testValidateTokenWithWrongPhoneNumber() {
        String token = jwtService.GenerateToken(testPhoneNumber);
        Boolean isValid = jwtService.validateToken(token, "1234567890");

        assertFalse(isValid, "Token should be invalid for wrong phone number");
    }

    @Test
    @DisplayName("Should extract expiration date from token")
    void testExtractExpiration() {
        String token = jwtService.GenerateToken(testPhoneNumber);

        assertDoesNotThrow(() -> {
            var expiration = jwtService.extractExpiration(token);
            assertNotNull(expiration, "Expiration date should not be null");
        });
    }

    @Test
    @DisplayName("Different tokens should be generated for different phone numbers")
    void testDifferentTokensForDifferentPhoneNumbers() {
        String token1 = jwtService.GenerateToken("1111111111");
        String token2 = jwtService.GenerateToken("2222222222");

        assertNotEquals(token1, token2, "Tokens for different phone numbers should be different");
    }
}
