package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

@Data
public class ParentResponse {
    public String status;
    public String statusCode;
    public String errorMsg;
}
