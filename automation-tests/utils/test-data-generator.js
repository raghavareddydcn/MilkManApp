const crypto = require('crypto');

class TestDataGenerator {
    /**
     * Generate random string
     */
    static randomString(length = 10) {
        return crypto.randomBytes(length).toString('hex').substring(0, length);
    }

    /**
     * Generate random number
     */
    static randomNumber(min = 1000, max = 9999) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate random email
     */
    static randomEmail() {
        return `test_${this.randomString(8)}@milkman.test`;
    }

    /**
     * Generate random phone
     */
    static randomPhone() {
        return `98${this.randomNumber(10000000, 99999999)}`;
    }

    /**
     * Generate customer registration data
     */
    static generateCustomerData() {
        const firstName = `Test${this.randomString(5)}`;
        const lastName = `User${this.randomString(5)}`;

        return {
            firstName: firstName,
            lastName: lastName,
            emailId: this.randomEmail(),
            primaryPhone: this.randomPhone(),
            password: 'Test@123',
            address: `${this.randomNumber(1, 999)} Test Street`,
            pinCode: this.randomNumber(100000, 999999).toString()
        };
    }

    /**
     * Generate product data
     */
    static generateProductData() {
        const productTypes = ['Milk', 'Curd', 'Butter', 'Ghee', 'Paneer'];
        const brands = ['Amul', 'Mother Dairy', 'Nandini', 'Aavin'];

        const type = productTypes[Math.floor(Math.random() * productTypes.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];

        return {
            productName: `${brand} ${type}`,
            productDescription: `Premium quality ${type.toLowerCase()} from ${brand}`,
            productPrice: this.randomNumber(20, 200),
            productQuantity: this.randomNumber(100, 1000),
            productUnit: 'ml',
            productCategory: type
        };
    }

    /**
     * Generate order data
     */
    static generateOrderData(customerId, productId) {
        return {
            customerId: customerId,
            orderDate: new Date().toISOString().split('T')[0],
            orderStatus: 'PENDING',
            totalAmount: this.randomNumber(100, 1000),
            deliveryAddress: `${this.randomNumber(1, 999)} Delivery Street`,
            products: [
                {
                    productId: productId,
                    quantity: this.randomNumber(1, 10),
                    price: this.randomNumber(20, 200)
                }
            ]
        };
    }

    /**
     * Generate subscription data
     */
    static generateSubscriptionData(customerId, productId) {
        const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY'];
        const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);

        return {
            customerId: customerId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            frequency: frequency,
            status: 'ACTIVE',
            deliveryAddress: `${this.randomNumber(1, 999)} Subscription Street`,
            products: [
                {
                    productId: productId,
                    quantity: this.randomNumber(1, 5),
                    price: this.randomNumber(20, 200)
                }
            ]
        };
    }

    /**
     * Generate authentication credentials
     */
    static generateAuthCredentials(emailOrPhone, password = 'Test@123') {
        return {
            emailIdOrPhone: emailOrPhone,
            password: password
        };
    }

    /**
     * Get current date in YYYY-MM-DD format
     */
    static getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Get future date
     */
    static getFutureDate(days = 30) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    /**
     * Get past date
     */
    static getPastDate(days = 30) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }
}

module.exports = TestDataGenerator;
