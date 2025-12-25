package com.dreamfutureone.milkmanui.data.datasources;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class MilkManDBHelper extends SQLiteOpenHelper {

    private static final int DATABASE_VERSION = 1;
    public static final String DATABASE_NAME = "milkman_db";
    public static final String CUSTOMER_TABLE_NAME = "customer_info";
    public static final String CUSTOMER_COLUMN_ID = "_id";
    public static final String CUSTOMER_COLUMN_CUSTOMER_ID = "customerId";
    public static final String CUSTOMER_COLUMN_CUSTOMER_NAME = "customerName";
    public static final String CUSTOMER_COLUMN_AUTH_TOKEN = "authToken";
    public static final String CUSTOMER_COLUMN_CREATED_TIME = "createdTime";
    public static final String CUSTOMER_COLUMN_UPDATED_TIME = "updatedTime";

    public static final String CREATE_CUSTOMER_TABLE_QUERY = "CREATE TABLE " + CUSTOMER_TABLE_NAME + " (" +
            CUSTOMER_COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
            CUSTOMER_COLUMN_CUSTOMER_ID + " TEXT, " +
            CUSTOMER_COLUMN_CUSTOMER_NAME + " TEXT, " +
            CUSTOMER_COLUMN_AUTH_TOKEN + " TEXT, " +
            CUSTOMER_COLUMN_CREATED_TIME + " TEXT, " +
            CUSTOMER_COLUMN_UPDATED_TIME + " TEXT)";

    public MilkManDBHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_CUSTOMER_TABLE_QUERY);

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + CUSTOMER_TABLE_NAME);
        onCreate(db);

    }
}
