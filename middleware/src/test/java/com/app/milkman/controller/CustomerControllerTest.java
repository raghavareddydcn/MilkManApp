package com.app.milkman.controller;

import com.app.milkman.model.CustomerAuthRequest;
import com.app.milkman.model.CustomerAuthResponse;
import com.app.milkman.model.CustomerRegRequest;
import com.app.milkman.model.CustomerRegResponse;
import com.app.milkman.service.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for testing
@DisplayName("Customer Controller Integration Tests")
class CustomerControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private CustomerService customerService;

        @Test
        @DisplayName("Should register customer successfully")
        void testRegisterCustomer() throws Exception {
                CustomerRegRequest request = new CustomerRegRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setPrimaryPhone("9876543210");
                request.setEmailId("john@example.com");
                request.setDateOfBirth(LocalDate.of(1990, 1, 1));
                request.setAddress("123 Main St");
                request.setPincode("500001");

                CustomerRegResponse response = CustomerRegResponse.builder()
                                .customerId("CUS001")
                                .customerName("John Doe")
                                .build();
                response.setStatus("SUCCESS");
                response.setStatusCode("200");

                when(customerService.registerCustomer(any())).thenReturn(response);

                mockMvc.perform(post("/customer/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("SUCCESS"));
        }

        @Test
        @DisplayName("Should authenticate customer successfully")
        void testAuthenticateCustomer() throws Exception {
                CustomerAuthRequest request = new CustomerAuthRequest();
                request.setEmailIdOrPhone("9876543210");
                request.setAuthPin("1234");

                CustomerAuthResponse response = CustomerAuthResponse.builder()
                                .customerId("CUS001")
                                .customerName("John Doe")
                                .authToken("token123")
                                .build();
                response.setStatus("SUCCESS");
                response.setStatusCode("200");

                when(customerService.authenticate(any())).thenReturn(response);

                mockMvc.perform(post("/customer/authenticate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("SUCCESS"));
        }
}
