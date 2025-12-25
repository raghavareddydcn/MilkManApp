package com.app.milkman.model;

import lombok.Data;

@Data
public class EmailRequest {

    private String recipient;
    private String msgBody;
    private String subject;
    private String attachment;
}
