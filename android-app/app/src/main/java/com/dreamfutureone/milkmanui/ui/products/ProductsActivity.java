package com.dreamfutureone.milkmanui.ui.products;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import com.dreamfutureone.milkmanui.R;
import com.dreamfutureone.milkmanui.databinding.ActivityProductsBinding;

public class ProductsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityProductsBinding binding = ActivityProductsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());


    }
}