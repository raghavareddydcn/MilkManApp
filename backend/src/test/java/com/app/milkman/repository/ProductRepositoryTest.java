package com.app.milkman.repository;

import com.app.milkman.entity.Products;
import com.app.milkman.repository.ProductsRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Product Repository Tests")
class ProductRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductsRepository productsRepository;

    @Test
    @DisplayName("Should save and find product by productId")
    void testSaveAndFindProduct() {
        // Arrange
        Products product = new Products();
        product.setProductId("TEST001");
        product.setProductName("Test Milk");
        product.setProductDescription("Test Description");
        product.setProductPrice(BigDecimal.valueOf(50.00));
        product.setCreatedTime(LocalDateTime.now());
        product.setStatus("ACTIVE");

        // Act
        entityManager.persistAndFlush(product);
        Products found = productsRepository.findByProductId("TEST001");

        // Assert
        assertNotNull(found, "Product should be found");
        assertEquals("Test Milk", found.getProductName());
        assertEquals(BigDecimal.valueOf(50.00), found.getProductPrice());
    }

    @Test
    @DisplayName("Should return null when product not found")
    void testFindNonExistentProduct() {
        Products found = productsRepository.findByProductId("NONEXISTENT");
        assertNull(found, "Should not find non-existent product");
    }

    @Test
    @DisplayName("Should count total products")
    void testCountProducts() {
        // Arrange
        Products p1 = createTestProduct("CNT001", "Product 1");
        Products p2 = createTestProduct("CNT002", "Product 2");
        entityManager.persist(p1);
        entityManager.persist(p2);
        entityManager.flush();

        // Act
        long count = productsRepository.count();

        // Assert
        assertTrue(count >= 2, "Should have at least 2 products");
    }

    @Test
    @DisplayName("Should find all products")
    void testFindAllProducts() {
        // Arrange
        Products product = createTestProduct("ALL001", "Find All Test");
        entityManager.persist(product);
        entityManager.flush();

        // Act
        var allProducts = productsRepository.findAll();

        // Assert
        assertFalse(allProducts.isEmpty(), "Should have products");
    }

    private Products createTestProduct(String id, String name) {
        Products product = new Products();
        product.setProductId(id);
        product.setProductName(name);
        product.setProductPrice(BigDecimal.valueOf(40.00));
        product.setStatus("ACTIVE");
        return product;
    }
}
