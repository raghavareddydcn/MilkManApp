package com.dreamfutureone.milkmanui.ui.account;

import android.content.Intent;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import com.dreamfutureone.milkmanui.R;
import com.dreamfutureone.milkmanui.databinding.ActivityCreateAccountBinding;
import com.dreamfutureone.milkmanui.ui.products.ProductsActivity;

public class CreateAccountActivity extends AppCompatActivity {

    private ActivityCreateAccountBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_create_account);
        binding = ActivityCreateAccountBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), ProductsActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }
}