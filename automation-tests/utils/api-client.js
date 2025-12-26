const axios = require('axios');
const config = require('../config/test-config');

class APIClient {
    constructor() {
        this.baseURL = config.api.baseURL;
        this.timeout = config.api.timeout;
        this.accessToken = null;
        this.refreshToken = null;
    }

    /**
     * Create axios instance with default configuration
     */
    createClient(token = null) {
        const headers = { ...config.api.headers };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const instance = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: headers,
            validateStatus: () => true // Don't throw on any status code
        });

        // Intercept response to map logical 'statusCode' (e.g. "401") in body to HTTP status (response.status)
        instance.interceptors.response.use(response => {
            if (response.status === 200 && response.data && response.data.statusCode) {
                const logicalCode = parseInt(response.data.statusCode, 10);
                if (!isNaN(logicalCode) && logicalCode !== 200) {
                    response.status = logicalCode;
                }
            }
            return response;
        }, error => {
            // Handle network errors etc
            return Promise.reject(error);
        });

        return instance;
    }

    /**
     * Set authentication tokens
     */
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    /**
     * Clear authentication tokens
     */
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
    }

    /**
     * Generic GET request
     */
    async get(endpoint, token = null) {
        const client = this.createClient(token);
        return await client.get(endpoint);
    }

    /**
     * Generic POST request
     */
    async post(endpoint, data, token = null) {
        const client = this.createClient(token);
        return await client.post(endpoint, data);
    }

    /**
     * Generic PUT request
     */
    async put(endpoint, data, token = null) {
        const client = this.createClient(token);
        return await client.put(endpoint, data);
    }

    /**
     * Generic DELETE request
     */
    async delete(endpoint, token = null) {
        const client = this.createClient(token);
        return await client.delete(endpoint);
    }

    // ==================== AUTHENTICATION APIs ====================

    /**
     * Customer Registration
     */
    async registerCustomer(customerData) {
        return await this.post('/customer/register', customerData);
    }

    /**
     * Customer Authentication
     */
    /**
     * Customer Authentication
     */
    async authenticateCustomer(credentials) {
        // API expects authPin, but tests provide password
        const payload = { ...credentials };
        if (payload.password && !payload.authPin) {
            payload.authPin = payload.password;
            delete payload.password;
        }

        const response = await this.post('/customer/authenticate', payload);

        // Map API 'authToken' to Test 'accessToken'
        if (response.data && response.data.authToken) {
            response.data.accessToken = response.data.authToken;
        }

        if (response.status === 200 && response.data.accessToken) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response;
    }

    /**
     * Admin Authentication
     */
    async authenticateAdmin(credentials) {
        // API expects authPin, but tests provide password
        const payload = { ...credentials };
        if (payload.password && !payload.authPin) {
            payload.authPin = payload.password;
            delete payload.password;
        }

        // Admin authenticates via same endpoint as customer
        const response = await this.post('/customer/authenticate', payload);

        // Map API 'authToken' to Test 'accessToken'
        if (response.data && response.data.authToken) {
            response.data.accessToken = response.data.authToken;
        }

        if (response.status === 200 && response.data.accessToken) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response;
    }

    /**
     * Refresh Token
     */
    async refreshAccessToken(refreshToken) {
        const response = await this.post('/customer/refresh-token', { refreshToken });

        // Map API 'authToken' to Test 'accessToken'
        if (response.data && response.data.authToken) {
            response.data.accessToken = response.data.authToken;
        }

        if (response.status === 200 && response.data.accessToken) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response;
    }

    // ==================== CUSTOMER APIs ====================

    /**
     * Get all customers (Admin only)
     */
    async getAllCustomers(page = 0, size = 10) {
        return await this.get(`/customer/getAll?page=${page}&size=${size}`);
    }

    /**
     * Get customer by ID
     */
    async getCustomerById(customerId) {
        return await this.get(`/customer/${customerId}`);
    }

    /**
     * Update customer
     */
    async updateCustomer(customerData) {
        return await this.put('/customer/update', customerData);
    }

    /**
     * Delete customer
     */
    async deleteCustomer(customerId) {
        return await this.delete(`/customer/${customerId}`);
    }

    // ==================== PRODUCT APIs ====================

    /**
     * Register product (Admin only)
     */
    async registerProduct(productData) {
        return await this.post('/product/register', productData);
    }

    /**
     * Update product (Admin only)
     */
    async updateProduct(productData) {
        return await this.put('/product/update', productData);
    }

    /**
     * Get all products
     */
    async getAllProducts(page = 0, size = 10) {
        return await this.get(`/product/getProducts?page=${page}&size=${size}`);
    }

    // ==================== ORDER APIs ====================

    /**
     * Create order
     */
    async createOrder(orderData) {
        return await this.post('/order/create', orderData);
    }

    /**
     * Get all orders
     */
    async getAllOrders(page = 0, size = 10) {
        return await this.get(`/order/getAllOrders?page=${page}&size=${size}`);
    }

    /**
     * Get orders by customer ID
     */
    async getOrdersByCustomerId(customerId, page = 0, size = 10) {
        return await this.get(`/order/getAllOrders/${customerId}?page=${page}&size=${size}`);
    }

    /**
     * Update order
     */
    async updateOrder(orderData) {
        return await this.put('/order/update', orderData);
    }

    /**
     * Delete order
     */
    async deleteOrder(orderId) {
        return await this.delete(`/order/delete/${orderId}`);
    }

    // ==================== SUBSCRIPTION APIs ====================

    /**
     * Create subscription
     */
    async createSubscription(subscriptionData) {
        return await this.post('/subscribe/create', subscriptionData);
    }

    /**
     * Get all subscriptions
     */
    async getAllSubscriptions(page = 0, size = 10) {
        return await this.get(`/subscribe/getAllSubscriptions?page=${page}&size=${size}`);
    }

    /**
     * Get subscriptions by customer ID
     */
    async getSubscriptionsByCustomerId(customerId, page = 0, size = 10) {
        return await this.get(`/subscribe/getAllSubscriptions/${customerId}?page=${page}&size=${size}`);
    }

    /**
     * Update subscription
     */
    async updateSubscription(subscriptionData) {
        return await this.put('/subscribe/update', subscriptionData);
    }

    /**
     * Delete subscription
     */
    async deleteSubscription(subscriptionId) {
        return await this.delete(`/subscribe/delete/${subscriptionId}`);
    }

    // ==================== HEALTH CHECK APIs ====================

    /**
     * Health check
     */
    async healthCheck() {
        return await this.get('/healthCheck');
    }

    /**
     * Test SMS
     */
    async testSMS() {
        return await this.get('/healthCheck/sms');
    }

    /**
     * Test Email
     */
    async testEmail() {
        return await this.get('/healthCheck/mail');
    }

    /**
     * Encrypt data
     */
    async encrypt(data) {
        return await this.get(`/healthCheck/encrypt?encrypt=${data}`);
    }

    /**
     * Decrypt data
     */
    async decrypt(data) {
        return await this.get(`/healthCheck/decrypt?decrypt=${data}`);
    }
}

module.exports = new APIClient();
