package com.app.milkman.component;

import com.app.milkman.model.ParentResponse;
import com.app.milkman.model.SMSRequest;
import com.app.milkman.utils.Constants;
import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.twilio.rest.api.v2010.account.Message;

@Slf4j
@Component
public class SMSComponent {
    @Autowired
    EncryptDecrypt encryptDecrypt;

    public ParentResponse sendSMS(SMSRequest smsRequest) {
        log.debug("SMS service invoked for!!! {}", smsRequest);
        Twilio.init(encryptDecrypt.decrypt(Constants.SMS_SID, Constants.KEY), encryptDecrypt.decrypt(Constants.SMS_TOKEN, Constants.KEY));
        Message.creator(new PhoneNumber(smsRequest.getToNumber()), new PhoneNumber(Constants.SMS_NUMBER), smsRequest.getTextMessage()).create();

        ParentResponse response = new ParentResponse();
        response.setStatus(Constants.SUCCESS);
        response.setStatusCode(Constants.SUCCESS_CODE);
        return response;
    }
}
