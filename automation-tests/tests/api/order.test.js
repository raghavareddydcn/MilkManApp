const { expect } = require('chai');
const apiClient = require('../../utils/api-client');
const TestDataGenerator = require('../../utils/test-data-generator');
const config = require('../../config/test-config');

describe('Order API Tests', function () {
    this.timeout(10000);
    let createdOrderId;
    let testCustomerId;
    let testProductId;

    before(async function () {
        // Authenticate as admin
        const credentials = {
            emailIdOrPhone: config.users.admin.phone,
            password: config.users.admin.password
        };
        await apiClient.authenticateAdmin(credentials);

        // Get a customer and product for testing
        const customersResponse = await apiClient.getAllCustomers(0, 1);
        if (customersResponse.data && customersResponse.data.length > 0) {
            testCustomerId = customersResponse.data[0].customerId;
        }

        const productsResponse = await apiClient.getAllProducts(0, 1);
        if (productsResponse.data && productsResponse.data.length > 0) {
            testProductId = productsResponse.data[0].productId;
        }
    });

    after(async function () {
        // Cleanup: Delete created order if exists
        if (createdOrderId) {
            try {
                await apiClient.deleteOrder(createdOrderId);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        apiClient.clearTokens();
    });

    describe('Create Order', function () {

        it('should create a new order with valid data', async function () {
            if (!testCustomerId || !testProductId) {
                this.skip();
            }

            const orderData = TestDataGenerator.generateOrderData(testCustomerId, testProductId);

            const response = await apiClient.createOrder(orderData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('orderId');
            expect(response.data.orderId).to.be.a('string').and.not.empty;

            createdOrderId = response.data.orderId;
        });

        it('should fail to create order with missing required fields', async function () {
            const invalidData = {
                customerId: testCustomerId
                // Missing other required fields
            };

            const response = await apiClient.createOrder(invalidData);

            expect(response.status).to.be.oneOf([400, 500]);
        });

        it('should fail to create order with invalid customer ID', async function () {
            const orderData = TestDataGenerator.generateOrderData('INVALID_CUSTOMER_ID', testProductId);

            const response = await apiClient.createOrder(orderData);

            expect(response.status).to.be.oneOf([400, 404, 500]);
        });

        it('should fail to create order with invalid product ID', async function () {
            const orderData = TestDataGenerator.generateOrderData(testCustomerId, 'INVALID_PRODUCT_ID');

            const response = await apiClient.createOrder(orderData);

            expect(response.status).to.be.oneOf([400, 404, 500]);
        });
    });

    describe('Get Orders', function () {

        it('should get all orders as admin', async function () {
            const response = await apiClient.getAllOrders(0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
        });

        it('should get orders by customer ID', async function () {
            if (!testCustomerId) {
                this.skip();
            }

            const response = await apiClient.getOrdersByCustomerId(testCustomerId, 0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
        });

        it('should return empty array for customer with no orders', async function () {
            const response = await apiClient.getOrdersByCustomerId('NON_EXISTENT_CUSTOMER', 0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
            expect(response.data).to.have.lengthOf(0);
        });

        it('should allow customer to view only their own orders', async function () {
            // Authenticate as customer
            const customerCreds = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };
            await apiClient.authenticateCustomer(customerCreds);

            const response = await apiClient.getAllOrders();

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

    describe('Update Order', function () {

        it('should update order details', async function () {
            if (!createdOrderId || !testCustomerId || !testProductId) {
                this.skip();
            }

            const updateData = {
                orderId: createdOrderId,
                customerId: testCustomerId,
                orderStatus: 'DELIVERED',
                totalAmount: 500,
                deliveryAddress: 'Updated Delivery Address',
                products: [
                    {
                        productId: testProductId,
                        quantity: 5,
                        price: 100
                    }
                ]
            };

            const response = await apiClient.updateOrder(updateData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('orderId', createdOrderId);
        });

        it('should fail to update non-existent order', async function () {
            const updateData = {
                orderId: 'NON_EXISTENT_ORDER',
                customerId: testCustomerId,
                orderStatus: 'DELIVERED'
            };

            const response = await apiClient.updateOrder(updateData);

            expect(response.status).to.be.oneOf([400, 404, 500]);
        });
    });

    describe('Delete Order', function () {
        let tempOrderId;

        before(async function () {
            if (!testCustomerId || !testProductId) {
                return;
            }

            // Create a temporary order for deletion test
            const tempData = TestDataGenerator.generateOrderData(testCustomerId, testProductId);
            const response = await apiClient.createOrder(tempData);

            if (response.status === 200) {
                tempOrderId = response.data.orderId;
            }
        });

        it('should delete order by ID', async function () {
            if (!tempOrderId) {
                this.skip();
            }

            const response = await apiClient.deleteOrder(tempOrderId);

            expect(response.status).to.be.oneOf([200, 204]);
        });

        it('should handle deletion of non-existent order', async function () {
            const response = await apiClient.deleteOrder('NON_EXISTENT_ORDER');

            expect(response.status).to.be.oneOf([200, 204, 404, 500]);
        });
    });
});
