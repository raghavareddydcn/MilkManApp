package com.app.milkman.controller;

import com.app.milkman.model.ProductRegRequest;
import com.app.milkman.model.ProductRegResponse;
import com.app.milkman.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product Controller Integration Tests")
class ProductControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private ProductService productService;

        @MockBean
        private com.app.milkman.component.JWTService jwtService;

        @Test
        @DisplayName("Should register product successfully")
        void testRegisterProduct() throws Exception {
                ProductRegRequest request = new ProductRegRequest();
                request.setProductId("P001");
                request.setProductName("Milk");
                request.setProductDescription("Fresh Milk");
                request.setPrice(50.00);

                ProductRegResponse response = ProductRegResponse.builder()
                                .productId("P001")
                                .productName("Milk")
                                .build();
                response.setStatus("SUCCESS");
                response.setStatusCode("200");

                when(productService.registerProduct(any())).thenReturn(response);

                mockMvc.perform(post("/product/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("SUCCESS"));
        }

        @Test
        @DisplayName("Should update product successfully")
        void testUpdateProduct() throws Exception {
                ProductRegRequest request = new ProductRegRequest();
                request.setProductId("P001");
                request.setProductName("Milk Updated");
                request.setPrice(55.00);

                ProductRegResponse response = ProductRegResponse.builder()
                                .productId("P001")
                                .productName("Milk Updated")
                                .build();
                response.setStatus("SUCCESS");

                when(productService.updateProduct(any())).thenReturn(response);

                mockMvc.perform(put("/product/update")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("SUCCESS"));
        }

        @Test
        @DisplayName("Should get all products")
        void testGetAllProducts() throws Exception {
                when(productService.getAllProducts(any())).thenReturn(new ArrayList<>());

                mockMvc.perform(get("/product/getProducts")
                                .param("page", "0")
                                .param("size", "10"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        }
}
