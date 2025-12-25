package com.app.milkman.model;

import lombok.Data;

@Data
public class SMSRequest {

    private  String toNumber;
    private  String textMessage;
}
