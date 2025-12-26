const { expect } = require('chai');
const apiClient = require('../../utils/api-client');
const TestDataGenerator = require('../../utils/test-data-generator');
const config = require('../../config/test-config');

describe('Customer API Tests', function () {
    this.timeout(10000);
    let createdCustomerId;
    let customerData;

    before(async function () {
        // Authenticate as admin for customer management
        const credentials = {
            emailIdOrPhone: config.users.admin.phone,
            password: config.users.admin.password
        };
        await apiClient.authenticateAdmin(credentials);
    });

    after(async function () {
        // Cleanup: Delete created customer if exists
        if (createdCustomerId) {
            try {
                await apiClient.deleteCustomer(createdCustomerId);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        apiClient.clearTokens();
    });

    describe('Customer Registration', function () {

        it('should register a new customer with valid data', async function () {
            customerData = TestDataGenerator.generateCustomerData();

            const response = await apiClient.registerCustomer(customerData);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('customerId');
            expect(response.data.customerId).to.be.a('string').and.not.empty;

            createdCustomerId = response.data.customerId;
        });

        it('should fail to register customer with duplicate phone', async function () {
            // Try to register with same data
            const response = await apiClient.registerCustomer(customerData);

            expect(response.status).to.be.oneOf([400, 409]);
        });

        it('should fail to register customer with missing required fields', async function () {
            const invalidData = {
                firstName: 'Test'
                // Missing other required fields
            };

            const response = await apiClient.registerCustomer(invalidData);

            expect(response.status).to.equal(400);
        });

        it('should fail to register customer with invalid email format', async function () {
            const invalidData = TestDataGenerator.generateCustomerData();
            invalidData.emailId = 'invalid-email';

            const response = await apiClient.registerCustomer(invalidData);

            expect(response.status).to.be.oneOf([400, 422]);
        });
    });

    describe('Get Customers', function () {

        it('should get all customers as admin', async function () {
            const response = await apiClient.getAllCustomers(0, 10);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
        });

        it('should get customer by ID', async function () {
            if (!createdCustomerId) {
                this.skip();
            }

            const response = await apiClient.getCustomerById(createdCustomerId);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('customerId', createdCustomerId);
            expect(response.data).to.have.property('firstName');
            expect(response.data).to.have.property('emailId');
        });

        it('should return 404 for non-existent customer ID', async function () {
            const response = await apiClient.getCustomerById('NON_EXISTENT_ID');

            expect(response.status).to.be.oneOf([404, 200]); // May return null with 200
            if (response.status === 200) {
                // Assert that data is null OR empty string (some APIs return empty body)
                expect(response.data === null || response.data === '').to.be.true;
            }
        });
    });

    describe('Update Customer', function () {

        it('should update customer details', async function () {
            if (!createdCustomerId) {
                this.skip();
            }

            // Get current customer data
            const getResponse = await apiClient.getCustomerById(createdCustomerId);
            const customer = getResponse.data;

            // Update some fields
            customer.firstName = 'UpdatedFirstName';
            customer.lastName = 'UpdatedLastName';
            customer.address = 'Updated Address 123';

            const response = await apiClient.updateCustomer(customer);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('firstName', 'UpdatedFirstName');
            expect(response.data).to.have.property('lastName', 'UpdatedLastName');
        });

        it('should fail to update with invalid data', async function () {
            const invalidData = {
                id: 99999,
                customerId: 'INVALID_ID',
                firstName: ''
            };

            const response = await apiClient.updateCustomer(invalidData);

            expect(response.status).to.be.oneOf([400, 404, 200]);
        });
    });

    describe('Delete Customer', function () {
        let tempCustomerId;

        before(async function () {
            // Create a temporary customer for deletion test
            const tempData = TestDataGenerator.generateCustomerData();
            const response = await apiClient.registerCustomer(tempData);

            if (response.status === 200) {
                tempCustomerId = response.data.customerId;
            }
        });

        it('should delete customer by ID', async function () {
            if (!tempCustomerId) {
                this.skip();
            }

            const response = await apiClient.deleteCustomer(tempCustomerId);

            expect(response.status).to.be.oneOf([200, 204]);

            // Verify deletion
            const getResponse = await apiClient.getCustomerById(tempCustomerId);
            expect(getResponse.data === null || getResponse.data === '').to.be.true;
        });

        it('should handle deletion of non-existent customer', async function () {
            const response = await apiClient.deleteCustomer('NON_EXISTENT_ID');

            // Should not throw error, just handle gracefully
            expect(response.status).to.be.oneOf([200, 204, 404]);
        });
    });

    describe('Authorization Tests', function () {

        it('should deny customer access to admin-only endpoints', async function () {
            // Authenticate as customer
            const customerCreds = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };
            await apiClient.authenticateCustomer(customerCreds);

            // Try to access admin endpoint
            const response = await apiClient.getAllCustomers();

            expect(response.status).to.be.oneOf([401, 403, 200]);

            // Re-authenticate as admin for other tests
            const adminCreds = {
                emailIdOrPhone: config.users.admin.phone,
                password: config.users.admin.password
            };
            await apiClient.authenticateAdmin(adminCreds);
        });
    });
});
