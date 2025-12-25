package com.app.milkman.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

@Component
@Slf4j
public class EncryptDecrypt {

    private static SecretKeySpec secretKey;
    private static byte[] key;
    private static final String ALGORITHM = "AES";

    public void prepareSecreteKey(String myKey) {
        MessageDigest sha = null;
        try {
            log.debug("Preparing key...{}", myKey);
            key = myKey.getBytes(StandardCharsets.UTF_8);
            sha = MessageDigest.getInstance("SHA-1");
            key = sha.digest(key);
            key = Arrays.copyOf(key, 16);
            secretKey = new SecretKeySpec(key, ALGORITHM);
        } catch (NoSuchAlgorithmException e) {
            log.error("Error while preparing key...{}", myKey);
        }
    }

    public String encrypt(String strToEncrypt, String secret) {
        String encryptedKey = null;
        try {
            log.debug("Encrypting key...{}", strToEncrypt);
            prepareSecreteKey(secret);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            encryptedKey = Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
        } catch (Exception e) {
            log.error("Error while Encrypting key...{}", strToEncrypt);
        }
        return encryptedKey;
    }

    public String decrypt(String strToDecrypt, String secret) {
        String decryptedKey = null;
        try {
            log.debug("Decrypting key...{}", strToDecrypt);
            prepareSecreteKey(secret);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            decryptedKey = new String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)));
        } catch (Exception e) {
            log.error("Error while Decrypting key...{}", strToDecrypt);
        }
        return decryptedKey;
    }
}
