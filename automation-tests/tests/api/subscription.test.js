const { expect } = require('chai');
const apiClient = require('../../utils/api-client');
const TestDataGenerator = require('../../utils/test-data-generator');
const config = require('../../config/test-config');

describe('Subscription API Tests', function () {
    this.timeout(10000);
    let createdSubscriptionId;
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
        // Cleanup: Delete created subscription if exists
        if (createdSubscriptionId) {
            try {
                await apiClient.deleteSubscription(createdSubscriptionId);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        apiClient.clearTokens();
    });

    describe('Create Subscription', function () {

        it('should create a new subscription with valid data', async function () {
            if (!testCustomerId || !testProductId) {
                this.skip();
            }

            const subscriptionData = TestDataGenerator.generateSubscriptionData(testCustomerId, testProductId);

            const response = await apiClient.createSubscription(subscriptionData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('subscriptionId');
            expect(response.data.subscriptionId).to.be.a('string').and.not.empty;

            createdSubscriptionId = response.data.subscriptionId;
        });

        it('should fail to create subscription with missing required fields', async function () {
            const invalidData = {
                customerId: testCustomerId
                // Missing other required fields
            };

            const response = await apiClient.createSubscription(invalidData);

            expect(response.status).to.equal(400);
        });

        it('should fail to create subscription with invalid customer ID', async function () {
            const subscriptionData = TestDataGenerator.generateSubscriptionData('INVALID_CUSTOMER_ID', testProductId);

            const response = await apiClient.createSubscription(subscriptionData);

            expect(response.status).to.be.oneOf([400, 404]);
        });

        it('should fail to create subscription with end date before start date', async function () {
            if (!testCustomerId || !testProductId) {
                this.skip();
            }

            const subscriptionData = TestDataGenerator.generateSubscriptionData(testCustomerId, testProductId);
            subscriptionData.startDate = TestDataGenerator.getFutureDate(30);
            subscriptionData.endDate = TestDataGenerator.getCurrentDate();

            const response = await apiClient.createSubscription(subscriptionData);

            expect(response.status).to.be.oneOf([400, 422]);
        });
    });

    describe('Get Subscriptions', function () {

        it('should get all subscriptions as admin', async function () {
            const response = await apiClient.getAllSubscriptions(0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
        });

        it('should get subscriptions by customer ID', async function () {
            if (!testCustomerId) {
                this.skip();
            }

            const response = await apiClient.getSubscriptionsByCustomerId(testCustomerId, 0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
        });

        it('should return empty array for customer with no subscriptions', async function () {
            const response = await apiClient.getSubscriptionsByCustomerId('NON_EXISTENT_CUSTOMER', 0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
            expect(response.data).to.have.lengthOf(0);
        });

        it('should allow customer to view only their own subscriptions', async function () {
            // Authenticate as customer
            const customerCreds = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };
            await apiClient.authenticateCustomer(customerCreds);

            const response = await apiClient.getAllSubscriptions();

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

    describe('Update Subscription', function () {

        it('should update subscription details', async function () {
            if (!createdSubscriptionId || !testCustomerId || !testProductId) {
                this.skip();
            }

            const updateData = {
                subscriptionId: createdSubscriptionId,
                customerId: testCustomerId,
                status: 'PAUSED',
                frequency: 'WEEKLY',
                deliveryAddress: 'Updated Subscription Address',
                products: [
                    {
                        productId: testProductId,
                        quantity: 3,
                        price: 100
                    }
                ]
            };

            const response = await apiClient.updateSubscription(updateData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('subscriptionId', createdSubscriptionId);
        });

        it('should fail to update non-existent subscription', async function () {
            const updateData = {
                subscriptionId: 'NON_EXISTENT_SUBSCRIPTION',
                customerId: testCustomerId,
                status: 'ACTIVE'
            };

            const response = await apiClient.updateSubscription(updateData);

            expect(response.status).to.be.oneOf([404, 400]);
        });
    });

    describe('Delete Subscription', function () {
        let tempSubscriptionId;

        before(async function () {
            if (!testCustomerId || !testProductId) {
                return;
            }

            // Create a temporary subscription for deletion test
            const tempData = TestDataGenerator.generateSubscriptionData(testCustomerId, testProductId);
            const response = await apiClient.createSubscription(tempData);

            if (response.status === 200) {
                tempSubscriptionId = response.data.subscriptionId;
            }
        });

        it('should delete subscription by ID', async function () {
            if (!tempSubscriptionId) {
                this.skip();
            }

            const response = await apiClient.deleteSubscription(tempSubscriptionId);

            expect(response.status).to.be.oneOf([200, 204]);
        });

        it('should handle deletion of non-existent subscription', async function () {
            const response = await apiClient.deleteSubscription('NON_EXISTENT_SUBSCRIPTION');

            expect(response.status).to.be.oneOf([200, 204, 404]);
        });
    });

    describe('Subscription Frequency Tests', function () {

        it('should create subscription with DAILY frequency', async function () {
            if (!testCustomerId || !testProductId) {
                this.skip();
            }

            const subscriptionData = TestDataGenerator.generateSubscriptionData(testCustomerId, testProductId);
            subscriptionData.frequency = 'DAILY';

            const response = await apiClient.createSubscription(subscriptionData);

            expect(response.status).to.equal(200);

            // Cleanup
            if (response.data && response.data.subscriptionId) {
                await apiClient.deleteSubscription(response.data.subscriptionId);
            }
        });

        it('should create subscription with WEEKLY frequency', async function () {
            if (!testCustomerId || !testProductId) {
                this.skip();
            }

            const subscriptionData = TestDataGenerator.generateSubscriptionData(testCustomerId, testProductId);
            subscriptionData.frequency = 'WEEKLY';

            const response = await apiClient.createSubscription(subscriptionData);

            expect(response.status).to.equal(200);

            // Cleanup
            if (response.data && response.data.subscriptionId) {
                await apiClient.deleteSubscription(response.data.subscriptionId);
            }
        });

        it('should create subscription with MONTHLY frequency', async function () {
            if (!testCustomerId || !testProductId) {
                this.skip();
            }

            const subscriptionData = TestDataGenerator.generateSubscriptionData(testCustomerId, testProductId);
            subscriptionData.frequency = 'MONTHLY';

            const response = await apiClient.createSubscription(subscriptionData);

            expect(response.status).to.equal(200);

            // Cleanup
            if (response.data && response.data.subscriptionId) {
                await apiClient.deleteSubscription(response.data.subscriptionId);
            }
        });
    });
});
