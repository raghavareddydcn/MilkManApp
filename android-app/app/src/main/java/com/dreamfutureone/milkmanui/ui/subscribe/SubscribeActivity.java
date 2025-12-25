package com.dreamfutureone.milkmanui.ui.subscribe;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.dreamfutureone.milkmanui.data.datasources.CommonDataSource;
import com.dreamfutureone.milkmanui.data.model.api.CustomerAuthResponse;
import com.dreamfutureone.milkmanui.data.model.api.ProductDetails;
import com.dreamfutureone.milkmanui.data.model.api.ProductOrdersReq;
import com.dreamfutureone.milkmanui.data.model.api.SubscribeRequest;
import com.dreamfutureone.milkmanui.data.repositories.MilkManDBRepo;
import com.dreamfutureone.milkmanui.databinding.ActivitySubscribeBinding;
import com.dreamfutureone.milkmanui.databinding.SubscriberProductsBinding;
import com.dreamfutureone.milkmanui.utils.MilkManConstant;
import retrofit.Callback;
import retrofit.Response;
import retrofit.Retrofit;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

public class SubscribeActivity extends AppCompatActivity {

    ActivitySubscribeBinding binding;
    String myFormat = "yyyy-MM-dd"; // In which you need put here
    SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.getDefault());
    Calendar myCalendar = Calendar.getInstance();
    CustomerAuthResponse customerRecord;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySubscribeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Retrieve customer details from DB.
        getCustomerDetails();

        loadProducts();

        binding.spFrequency.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String frequency = parent.getItemAtPosition(position).toString();
                if ("Weekly".equalsIgnoreCase(frequency)) {
                    binding.freqWeekly.setVisibility(View.VISIBLE);
                } else {
                    binding.freqWeekly.setVisibility(View.GONE);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        binding.btnSubscribe.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                sendSubscribeRequest();
            }
        });


        DatePickerDialog.OnDateSetListener stDatePicker = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar myCalendar = Calendar.getInstance();
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);

                binding.etStartDate.setText(sdf.format(myCalendar.getTime()).toString());
            }
        };

        DatePickerDialog.OnDateSetListener endDatePicker = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar myCalendar = Calendar.getInstance();
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);

                binding.etEndDate.setText(sdf.format(myCalendar.getTime()).toString());
            }
        };

        binding.etStartDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new DatePickerDialog(SubscribeActivity.this, stDatePicker, myCalendar.get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                        myCalendar.get(Calendar.DAY_OF_MONTH)).show();
            }
        });

        binding.etEndDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new DatePickerDialog(SubscribeActivity.this, endDatePicker, myCalendar.get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                        myCalendar.get(Calendar.DAY_OF_MONTH)).show();
            }
        });
    }


    public boolean sendSubscribeRequest() {

        String startDate = binding.etStartDate.getText().toString();
        String endDate = binding.etEndDate.getText().toString();
        String slot = binding.spSlot.getSelectedItem().toString();
        String frequency = binding.spFrequency.getSelectedItem().toString();


        SubscribeRequest subRequest = new SubscribeRequest();
        subRequest.setCustomerId(customerRecord.getCustomerId());

        //Product details setting
        List<ProductOrdersReq> products = new ArrayList<>();
        ProductOrdersReq productOrdersReq;

        for (int i = 0; i < binding.productGroup.getChildCount(); i++) {
            View productRoot = binding.productGroup.getChildAt(i);

            View etQuantity = ((LinearLayout) productRoot).getChildAt(2);
            View txtPrdId = ((LinearLayout) productRoot).getChildAt(3);

            String qty = ((EditText) etQuantity).getText().toString();
            String prdId = ((TextView) txtPrdId).getText().toString();

            productOrdersReq = new ProductOrdersReq();
            productOrdersReq.setProductId(prdId);
            productOrdersReq.setQuantity(Integer.parseInt(qty));
            products.add(productOrdersReq);
        }
        subRequest.setProductOrderReqs(products);

        //Delivery details setting
        subRequest.setDeliveryStartDate(startDate);
        subRequest.setDeliveryEndDate(endDate);
        subRequest.setDeliveryTimeSlot(slot);
        subRequest.setDeliveryFrequency(frequency);
        if ("Weekly".equalsIgnoreCase(frequency)) {
            List<String> selectedDays = new ArrayList<>();
            if (binding.cbMonday.isChecked()) {
                selectedDays.add(MilkManConstant.monday);
            }

            if (binding.cbTuesday.isChecked()) {
                selectedDays.add(MilkManConstant.tuesday);
            }
            if (binding.cbWednesday.isChecked()) {
                selectedDays.add(MilkManConstant.wednesday);
            }
            if (binding.cbThursday.isChecked()) {
                selectedDays.add(MilkManConstant.thursday);
            }
            if (binding.cbFriday.isChecked()) {
                selectedDays.add(MilkManConstant.friday);
            }
            if (binding.cbSaturday.isChecked()) {
                selectedDays.add(MilkManConstant.saturday);
            }
            if (binding.cbSunday.isChecked()) {
                selectedDays.add(MilkManConstant.sunday);
            }
            subRequest.setDeliveryDays(selectedDays);
        } else {
            subRequest.setDeliveryDays(MilkManConstant.daily);
        }

        CommonDataSource dataSource = new CommonDataSource();
        dataSource.subscribe(subRequest, new Callback() {
            @Override
            public void onResponse(Response response, Retrofit retrofit) {
                Toast.makeText(SubscribeActivity.this, response.message(), Toast.LENGTH_SHORT).show();
                if (response.isSuccess()) {


                } else {

                }
            }

            @Override
            public void onFailure(Throwable t) {

            }
        });

        return false;
    }

    public void getCustomerDetails() {
        MilkManDBRepo milkManDBRepo = new MilkManDBRepo(SubscribeActivity.this);
        customerRecord = milkManDBRepo.getCustomerRecord();
    }

    public void loadProducts() {
        CommonDataSource commonDataSource = new CommonDataSource();
        commonDataSource.getProducts(new Callback() {
            @Override
            public void onResponse(Response response, Retrofit retrofit) {
                if (response.isSuccess()) {

                    List<ProductDetails> body = (List<ProductDetails>) response.body();
                    for (ProductDetails product : body) {
                        LinearLayout root = SubscriberProductsBinding.inflate(getLayoutInflater()).getRoot();

                        View txtProductName = root.getChildAt(1);
                        View txtPrdId = root.getChildAt(3);

                        ((TextView) txtProductName).setText(product.getProductName());

                        TextView txtPrdId1 = (TextView) txtPrdId;
                        txtPrdId1.setText(product.getProductId());
                        txtPrdId1.setVisibility(View.GONE);
                        binding.productGroup.addView(root);
                    }
                }
            }

            @Override
            public void onFailure(Throwable t) {
                Toast.makeText(SubscribeActivity.this, t.toString(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}