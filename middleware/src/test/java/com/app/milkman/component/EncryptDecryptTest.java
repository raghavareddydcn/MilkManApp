package com.app.milkman.component;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Encrypt/Decrypt Service Tests")
class EncryptDecryptTest {

    private EncryptDecrypt encryptDecrypt;
    private final String secretKey = "MySecretKey123";
    private final String testData = "SensitiveData123";

    @BeforeEach
    void setUp() {
        encryptDecrypt = new EncryptDecrypt();
    }

    @Test
    @DisplayName("Should encrypt data successfully")
    void testEncrypt() {
        String encrypted = encryptDecrypt.encrypt(testData, secretKey);

        assertNotNull(encrypted, "Encrypted data should not be null");
        assertFalse(encrypted.isEmpty(), "Encrypted data should not be empty");
        assertNotEquals(testData, encrypted, "Encrypted data should be different from original");
    }

    @Test
    @DisplayName("Should decrypt data successfully")
    void testDecrypt() {
        String encrypted = encryptDecrypt.encrypt(testData, secretKey);
        String decrypted = encryptDecrypt.decrypt(encrypted, secretKey);

        assertEquals(testData, decrypted, "Decrypted data should match original");
    }

    @Test
    @DisplayName("Should encrypt and decrypt round-trip successfully")
    void testEncryptDecryptRoundTrip() {
        String encrypted = encryptDecrypt.encrypt(testData, secretKey);
        String decrypted = encryptDecrypt.decrypt(encrypted, secretKey);

        assertEquals(testData, decrypted, "Round-trip encryption/decryption should preserve data");
    }

    @Test
    @DisplayName("Encryption with different keys should produce different results")
    void testDifferentKeys() {
        String encrypted1 = encryptDecrypt.encrypt(testData, "key1");
        String encrypted2 = encryptDecrypt.encrypt(testData, "key2");

        assertNotEquals(encrypted1, encrypted2, "Different keys should produce different encrypted values");
    }

    @Test
    @DisplayName("Should handle empty string encryption")
    void testEmptyStringEncryption() {
        String encrypted = encryptDecrypt.encrypt("", secretKey);
        String decrypted = encryptDecrypt.decrypt(encrypted, secretKey);

        assertEquals("", decrypted, "Empty string should be encrypted and decrypted correctly");
    }
}
