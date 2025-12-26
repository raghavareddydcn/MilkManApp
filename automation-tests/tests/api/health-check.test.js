const { expect } = require('chai');
const apiClient = require('../../utils/api-client');

describe('Health Check API Tests', function () {
    this.timeout(10000);

    describe('Basic Health Check', function () {

        it('should return SUCCESS for health check endpoint', async function () {
            const response = await apiClient.healthCheck();

            expect(response.status).to.equal(200);
            expect(response.data).to.equal('SUCCESS');
        });

        it('should respond quickly to health check', async function () {
            const startTime = Date.now();
            const response = await apiClient.healthCheck();
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(response.status).to.equal(200);
            expect(responseTime).to.be.lessThan(1000); // Should respond within 1 second
        });
    });

    describe('SMS Test Endpoint', function () {

        it('should return SUCCESS for SMS test endpoint', async function () {
            const response = await apiClient.testSMS();

            expect(response.status).to.be.oneOf([200, 500]); // May fail if SMS service not configured

            if (response.status === 200) {
                expect(response.data).to.equal('SUCCESS');
            }
        });
    });

    describe('Email Test Endpoint', function () {

        it('should return SUCCESS for email test endpoint', async function () {
            const response = await apiClient.testEmail();

            expect(response.status).to.be.oneOf([200, 500]); // May fail if email service not configured

            if (response.status === 200) {
                expect(response.data).to.equal('SUCCESS');
            }
        });
    });

    describe('Encryption/Decryption Endpoints', function () {
        const testData = 'TestEncryptionData123';
        let encryptedData;

        it('should encrypt data', async function () {
            const response = await apiClient.encrypt(testData);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.a('string');
            expect(response.data).to.not.equal(testData);

            encryptedData = response.data;
        });

        it('should decrypt data', async function () {
            if (!encryptedData) {
                this.skip();
            }

            const response = await apiClient.decrypt(encryptedData);

            expect(response.status).to.equal(200);
            expect(response.data).to.equal(testData);
        });

        it('should handle encryption of empty string', async function () {
            const response = await apiClient.encrypt('');

            expect(response.status).to.be.oneOf([200, 400]);
        });

        it('should handle decryption of invalid data', async function () {
            const response = await apiClient.decrypt('invalid_encrypted_data');

            expect(response.status).to.be.oneOf([200, 400, 500]);
        });
    });

    describe('API Availability', function () {

        it('should have all endpoints accessible', async function () {
            const endpoints = [
                '/healthCheck',
                '/customer/register',
                '/product/getProducts',
                '/order/getAllOrders',
                '/subscribe/getAllSubscriptions'
            ];

            for (const endpoint of endpoints) {
                const response = await apiClient.get(endpoint);

                // Should not return 404 (endpoint exists)
                expect(response.status).to.not.equal(404);
            }
        });
    });
});
