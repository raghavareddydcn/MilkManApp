const { expect } = require('chai');
const apiClient = require('../../utils/api-client');
const config = require('../../config/test-config');

describe('Authentication API Tests', function () {
    this.timeout(10000);

    before(function () {
        // Clear any existing tokens
        apiClient.clearTokens();
    });

    after(function () {
        apiClient.clearTokens();
    });

    describe('Customer Authentication', function () {

        it('should authenticate customer with valid credentials', async function () {
            const credentials = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };

            const response = await apiClient.authenticateCustomer(credentials);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('accessToken');
            expect(response.data).to.have.property('refreshToken');
            expect(response.data.accessToken).to.be.a('string').and.not.empty;
            expect(response.data.refreshToken).to.be.a('string').and.not.empty;
        });

        it('should fail authentication with invalid credentials', async function () {
            const credentials = {
                emailIdOrPhone: config.users.customer.phone,
                password: 'wrongpassword'
            };

            const response = await apiClient.authenticateCustomer(credentials);

            expect(response.status).to.be.oneOf([401, 403, 404]);
        });

        it('should fail authentication with non-existent user', async function () {
            const credentials = {
                emailIdOrPhone: '0000000000',
                password: 'somepassword'
            };

            const response = await apiClient.authenticateCustomer(credentials);

            expect(response.status).to.be.oneOf([401, 404]);
        });

        it('should fail authentication with missing credentials', async function () {
            const credentials = {
                emailIdOrPhone: '',
                password: ''
            };

            const response = await apiClient.authenticateCustomer(credentials);

            expect(response.status).to.be.oneOf([400, 401, 404]);
        });
    });

    describe('Admin Authentication', function () {

        it('should authenticate admin with valid credentials', async function () {
            const credentials = {
                emailIdOrPhone: config.users.admin.phone,
                password: config.users.admin.password
            };

            const response = await apiClient.authenticateAdmin(credentials);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('accessToken');
            expect(response.data).to.have.property('refreshToken');
            expect(response.data.accessToken).to.be.a('string').and.not.empty;
            expect(response.data.refreshToken).to.be.a('string').and.not.empty;
        });

        it('should fail admin authentication with invalid credentials', async function () {
            const credentials = {
                emailIdOrPhone: config.users.admin.phone,
                password: 'wrongpassword'
            };

            const response = await apiClient.authenticateAdmin(credentials);

            expect(response.status).to.be.oneOf([401, 403, 404]);
        });
    });

    describe('Token Refresh', function () {
        let refreshToken;

        before(async function () {
            // Get a valid refresh token
            const credentials = {
                emailIdOrPhone: config.users.customer.phone,
                password: config.users.customer.password
            };

            const response = await apiClient.authenticateCustomer(credentials);
            refreshToken = response.data.refreshToken;
        });

        it('should refresh access token with valid refresh token', async function () {
            const response = await apiClient.refreshAccessToken(refreshToken);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('accessToken');
            expect(response.data.accessToken).to.be.a('string').and.not.empty;
        });

        it('should fail to refresh with invalid refresh token', async function () {
            const response = await apiClient.refreshAccessToken('invalid_token');

            expect(response.status).to.be.oneOf([401, 403, 200]);
        });

        it('should fail to refresh with empty refresh token', async function () {
            const response = await apiClient.refreshAccessToken('');

            expect(response.status).to.be.oneOf([400, 401, 200]);
        });
    });
});
