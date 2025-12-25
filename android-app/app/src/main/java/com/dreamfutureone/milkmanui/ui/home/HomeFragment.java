package com.dreamfutureone.milkmanui.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import com.dreamfutureone.milkmanui.data.datasources.CommonDataSource;
import com.dreamfutureone.milkmanui.data.model.api.CustomerAuthResponse;
import com.dreamfutureone.milkmanui.data.model.api.SubscriptionDetails;
import com.dreamfutureone.milkmanui.data.repositories.MilkManDBRepo;
import com.dreamfutureone.milkmanui.databinding.FragmentHomeBinding;
import com.dreamfutureone.milkmanui.databinding.SubscriptionsBinding;
import retrofit.Callback;
import retrofit.Response;
import retrofit.Retrofit;

import java.util.List;
import java.util.stream.Collectors;

public class HomeFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private FragmentHomeBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textHome;
        homeViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });

        addSubscription(root);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    public void addSubscription(View view) {
        //Collect customer details from DB
        MilkManDBRepo milkManDBRepo = new MilkManDBRepo(view.getContext());
        CustomerAuthResponse customerRecord = milkManDBRepo.getCustomerRecord();

        //Get Subscriptions from Server
        CommonDataSource commonDataSource = new CommonDataSource();
        commonDataSource.getSubscriptions(customerRecord.getCustomerId(), new Callback() {
            @Override
            public void onResponse(Response response, Retrofit retrofit) {
                if (response.isSuccess()) {

                    List<SubscriptionDetails> subscriptions = (List<SubscriptionDetails>) response.body();
                    for (SubscriptionDetails subscription : subscriptions) {
                        SubscriptionsBinding subscriptionsLayout = SubscriptionsBinding.inflate(getLayoutInflater());

                        // Products set
                        String products = subscription.getSubscriptionProductDetails().stream().map(
                                pd -> pd.getProductName() + "(" + pd.getQuantity() + ")").collect(Collectors.joining("\n"));
                        subscriptionsLayout.tvProducts.setText(products);

                        // Subscription details
                        String subscriptionDuration = subscription.getDeliveryStartDate() +
                                " to " + subscription.getDeliveryEndDate();
                        subscriptionsLayout.tvSubscription.setText(subscriptionDuration);

                        // Slot Details
                        subscriptionsLayout.tvSlots.setText("Slot: " + subscription.getDeliveryTimeSlot());

                        // Frequency
                        subscriptionsLayout.tvDays.setText("Days: " + subscription.getDeliveryDays().replaceAll(",", "\n"));

                        binding.getRoot().addView(subscriptionsLayout.getRoot());
                    }
                }
            }

            @Override
            public void onFailure(Throwable t) {
                Toast.makeText(view.getContext(), "Home screen error "+t.toString(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}