const { expect } = require('chai');
const apiClient = require('../../utils/api-client');
const TestDataGenerator = require('../../utils/test-data-generator');
const config = require('../../config/test-config');

describe('Product API Tests', function () {
    this.timeout(10000);
    let createdProductId;
    let productData;

    before(async function () {
        // Authenticate as admin
        const credentials = {
            emailIdOrPhone: config.users.admin.phone,
            password: config.users.admin.password
        };
        await apiClient.authenticateAdmin(credentials);
    });

    after(async function () {
        apiClient.clearTokens();
    });

    describe('Product Registration', function () {

        it('should register a new product with valid data', async function () {
            productData = TestDataGenerator.generateProductData();

            const response = await apiClient.registerProduct(productData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('productId');
            expect(response.data.productId).to.be.a('string').and.not.empty;

            createdProductId = response.data.productId;
        });

        it('should fail to register product with missing required fields', async function () {
            const invalidData = {
                productName: 'Test Product'
                // Missing other required fields
            };

            const response = await apiClient.registerProduct(invalidData);

            expect(response.status).to.equal(400);
        });

        it('should fail to register product with invalid price', async function () {
            const invalidData = TestDataGenerator.generateProductData();
            invalidData.productPrice = -10;

            const response = await apiClient.registerProduct(invalidData);

            expect(response.status).to.be.oneOf([400, 422]);
        });

        it('should fail to register product with invalid quantity', async function () {
            const invalidData = TestDataGenerator.generateProductData();
            invalidData.productQuantity = -5;

            const response = await apiClient.registerProduct(invalidData);

            expect(response.status).to.be.oneOf([400, 422]);
        });
    });

    describe('Get Products', function () {

        it('should get all products', async function () {
            const response = await apiClient.getAllProducts(0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');

            if (response.data.length > 0) {
                const product = response.data[0];
                expect(product).to.have.property('productId');
                expect(product).to.have.property('productName');
                expect(product).to.have.property('productPrice');
            }
        });

        it('should get products with pagination', async function () {
            const page1 = await apiClient.getAllProducts(0, 5);
            const page2 = await apiClient.getAllProducts(1, 5);

            expect(page1.status).to.equal(200);
            expect(page2.status).to.equal(200);
            expect(page1.data).to.be.an('array');
            expect(page2.data).to.be.an('array');
        });

        it('should allow customers to view products', async function () {
            // Authenticate as customer
            const customerCreds = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };
            await apiClient.authenticateCustomer(customerCreds);

            const response = await apiClient.getAllProducts();

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');

            // Re-authenticate as admin
            const adminCreds = {
                emailIdOrPhone: config.users.admin.phone,
                password: config.users.admin.password
            };
            await apiClient.authenticateAdmin(adminCreds);
        });
    });

    describe('Update Product', function () {

        it('should update product details', async function () {
            if (!createdProductId) {
                this.skip();
            }

            const updateData = {
                productId: createdProductId,
                productName: 'Updated Product Name',
                productDescription: 'Updated description',
                productPrice: 150,
                productQuantity: 500,
                productUnit: 'ml',
                productCategory: 'Milk'
            };

            const response = await apiClient.updateProduct(updateData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('productId', createdProductId);
        });

        it('should fail to update non-existent product', async function () {
            const updateData = {
                productId: 'NON_EXISTENT_ID',
                productName: 'Test',
                productPrice: 100
            };

            const response = await apiClient.updateProduct(updateData);

            expect(response.status).to.be.oneOf([404, 400]);
        });

        it('should fail to update product with invalid data', async function () {
            if (!createdProductId) {
                this.skip();
            }

            const updateData = {
                productId: createdProductId,
                productPrice: -100 // Invalid price
            };

            const response = await apiClient.updateProduct(updateData);

            expect(response.status).to.be.oneOf([400, 422]);
        });
    });

    describe('Authorization Tests', function () {

        it('should deny customer access to product registration', async function () {
            // Authenticate as customer
            const customerCreds = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };
            await apiClient.authenticateCustomer(customerCreds);

            const productData = TestDataGenerator.generateProductData();
            const response = await apiClient.registerProduct(productData);

            expect(response.status).to.be.oneOf([401, 403]);

            // Re-authenticate as admin
            const adminCreds = {
                emailIdOrPhone: config.users.admin.phone,
                password: config.users.admin.password
            };
            await apiClient.authenticateAdmin(adminCreds);
        });

        it('should deny customer access to product update', async function () {
            // Authenticate as customer
            const customerCreds = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };
            await apiClient.authenticateCustomer(customerCreds);

            const updateData = {
                productId: createdProductId,
                productName: 'Hacked Product'
            };
            const response = await apiClient.updateProduct(updateData);

            expect(response.status).to.be.oneOf([401, 403]);

            // Re-authenticate as admin
            const adminCreds = {
                emailIdOrPhone: config.users.admin.phone,
                password: config.users.admin.password
            };
            await apiClient.authenticateAdmin(adminCreds);
        });
    });
});
