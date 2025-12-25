package com.dreamfutureone.milkmanui.data.repositories;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.widget.Toast;
import com.dreamfutureone.milkmanui.data.datasources.MilkManDBHelper;
import com.dreamfutureone.milkmanui.data.model.api.CustomerAuthResponse;

public class MilkManDBRepo {

    Context context;

    public MilkManDBRepo(Context context) {
        this.context = context;
    }

    public void saveCustomer(String customerId, String customerName, String authToken) {
        SQLiteDatabase db = new MilkManDBHelper(context).getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(MilkManDBHelper.CUSTOMER_COLUMN_CUSTOMER_ID, customerId);
        values.put(MilkManDBHelper.CUSTOMER_COLUMN_CUSTOMER_NAME, customerName);
        values.put(MilkManDBHelper.CUSTOMER_COLUMN_AUTH_TOKEN, authToken);
        long newRowId = db.insert(MilkManDBHelper.CUSTOMER_TABLE_NAME, null, values);

        Toast.makeText(context, "Customer token added " + newRowId, Toast.LENGTH_LONG).show();

    }

    public void clearCustomerDB() {
        SQLiteDatabase db = new MilkManDBHelper(context).getWritableDatabase();
        db.execSQL("DELETE FROM " + MilkManDBHelper.CUSTOMER_TABLE_NAME);
    }

    public CustomerAuthResponse getCustomerRecord() {
        CustomerAuthResponse response = new CustomerAuthResponse();
        SQLiteDatabase db = new MilkManDBHelper(context).getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + MilkManDBHelper.CUSTOMER_TABLE_NAME + " WHERE " +
                MilkManDBHelper.CUSTOMER_COLUMN_CUSTOMER_ID + " is not null", null);
        if (null != cursor) {
            cursor.moveToFirst();
            String customerId = cursor.getString(1);
            String customerName = cursor.getString(2);
            String authToken = cursor.getString(3);

            response.setCustomerId(customerId);
            response.setCustomerName(customerName);
            response.setAuthToken(authToken);
        }
        return response;
    }
}
