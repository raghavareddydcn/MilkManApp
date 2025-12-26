const axios = require('axios');
const config = require('../config/test-config');

const API_URL = config.api.baseURL;

async function seed() {
    console.log(`Seeding Database at ${API_URL}...`);

    // 1. Customer
    const customer = {
        firstName: 'Test',
        lastName: 'Customer',
        primaryPhone: config.users.customer.phone,
        emailId: config.users.customer.email,
        dateOfBirth: '1990-01-01',
        address: 'Test Address',
        pincode: '123456',
        authPin: config.users.customer.password
    };

    try {
        console.log('Registering Customer:', customer.primaryPhone);
        const res = await axios.post(`${API_URL}/customer/register`, customer);

        if (res.data.statusCode && res.data.statusCode !== '200') {
            if (res.data.statusCode === '409') {
                console.log('Customer already exists (Logical 409)');
            } else {
                throw new Error(`Registration Failed: ${JSON.stringify(res.data)}`);
            }
        } else {
            console.log('Customer seeded successfully.');
        }
    } catch (e) {
        if (e.response && e.response.status === 409) {
            console.log('Customer already exists (HTTP 409)');
        } else {
            console.error('Failed to seed Customer:', e.message);
            if (e.response) console.error('Response:', e.response.data);
            process.exit(1);
        }
    }

    // 1.1 Verify Login
    try {
        console.log('Verifying Customer Login...');
        const login = { emailIdOrPhone: customer.primaryPhone, authPin: customer.authPin, loginType: "customer" };
        // Note: loginType might be needed if API differs, but based on Service it's not strictly used in query
        const res = await axios.post(`${API_URL}/customer/authenticate`, login);

        if (res.data.statusCode !== '200') {
            throw new Error(`Verification Login Failed: ${JSON.stringify(res.data)}`);
        }
        console.log('Customer Login Verified.');
    } catch (e) {
        console.error('Login Verification Failed:', e.message);
        if (e.response) console.error('Response:', e.response.data);
        process.exit(1);
    }

    // 2. Admin (as User)
    const admin = {
        firstName: 'Test',
        lastName: 'Admin',
        primaryPhone: config.users.admin.phone,
        emailId: config.users.admin.email,
        dateOfBirth: '1990-01-01',
        address: 'Admin Address',
        pincode: '123456',
        authPin: config.users.admin.password
    };

    try {
        console.log('Registering Admin:', admin.primaryPhone);
        const res = await axios.post(`${API_URL}/customer/register`, admin);

        if (res.data.statusCode && res.data.statusCode !== '200') {
            if (res.data.statusCode === '409') {
                console.log('Admin already exists (Logical 409)');
            } else {
                throw new Error(`Registration Failed: ${JSON.stringify(res.data)}`);
            }
        } else {
            console.log('Admin seeded successfully (as User).');
        }
    } catch (e) {
        if (e.response && e.response.status === 409) {
            console.log('Admin already exists (HTTP 409)');
        } else {
            console.error('Failed to seed Admin:', e.message);
            if (e.response) console.error('Response:', e.response.data);
            process.exit(1);
        }
    }
}

seed();
