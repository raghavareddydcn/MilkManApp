package com.app.milkman.utils;

import java.text.SimpleDateFormat;
import java.time.LocalDate;

public class MilkManUtil {

    public LocalDate convertDate(String strDate) {

        return LocalDate.parse(strDate);
    }
}
