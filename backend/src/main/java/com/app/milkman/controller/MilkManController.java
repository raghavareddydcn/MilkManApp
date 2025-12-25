package com.app.milkman.controller;

import com.app.milkman.component.EmailComponent;
import com.app.milkman.model.EmailRequest;
import com.app.milkman.model.SMSRequest;
import com.app.milkman.component.EncryptDecrypt;
import com.app.milkman.component.SMSComponent;
import com.app.milkman.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RequestMapping("/healthCheck")
@RestController
public class MilkManController {

    @Autowired
    private SMSComponent smsService;

    @Autowired
    private EncryptDecrypt encryptDecrypt;

    @Autowired
    private EmailComponent emailComponent;

    @GetMapping("")
    public String health() {


        return "SUCCESS";
    }

    @GetMapping("/sms")
    public String sms() {
        SMSRequest sms = new SMSRequest();
        sms.setToNumber("+919566085621");
        sms.setTextMessage("test");
        smsService.sendSMS(sms);
        return "SUCCESS";
    }

    @GetMapping("/mail")
    public String mail() {
        EmailRequest email = new EmailRequest();
        email.setRecipient("raghavareddy.dcn@gmail.com");
        email.setSubject("MILK MAN");
        email.setMsgBody("Sample mail ...");
        emailComponent.sendEmail(email);
        return "SUCCESS";
    }


    @GetMapping("/encrypt")
    public String encrypt(String encrypt) {
        return encryptDecrypt.encrypt(encrypt, Constants.KEY);
    }

    @GetMapping("/decrypt")
    public String decrypt(String decrypt) {
        return encryptDecrypt.decrypt(decrypt, Constants.KEY);
    }
}
