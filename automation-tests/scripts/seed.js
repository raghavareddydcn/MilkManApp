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
        console.log('Customer seeded successfully. Status:', res.status);
    } catch (e) {
        if (e.response && (e.response.status === 409 || (e.response.data && e.response.data.statucCode === '409'))) {
            console.log('Customer already exists');
        } else {
            console.error('Failed to seed Customer:', e.message);
            if (e.response) console.error('Response:', e.response.data);
            process.exit(1);
        }
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
        console.log('Admin seeded successfully (as User). Status:', res.status);
    } catch (e) {
        if (e.response && (e.response.status === 409 || (e.response.data && e.response.data.statucCode === '409'))) {
            console.log('Admin already exists');
        } else {
            console.error('Failed to seed Admin:', e.message);
            if (e.response) console.error('Response:', e.response.data);
            process.exit(1);
        }
    }
}

seed();
