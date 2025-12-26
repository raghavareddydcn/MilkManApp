const { expect } = require('chai');
const WebDriver = require('../../utils/web-driver');
const RegisterPage = require('../../pages/RegisterPage');
const TestDataGenerator = require('../../utils/test-data-generator');
const config = require('../../config/test-config');

describe('Registration Page UI Tests', function () {
    this.timeout(30000);
    let driver;
    let webDriver;
    let registerPage;

    before(async function () {
        webDriver = new WebDriver();
        driver = await webDriver.init();
        registerPage = new RegisterPage(webDriver);
    });

    after(async function () {
        if (webDriver) {
            await webDriver.quit();
        }
    });

    beforeEach(async function () {
        await webDriver.navigateTo('/register');
    });

    describe('Page Load and Elements', function () {

        it('should load registration page successfully', async function () {
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('register');
        });

        it('should display all registration form fields', async function () {
            const firstNamePresent = await webDriver.isElementPresent(registerPage.firstNameInput);
            const lastNamePresent = await webDriver.isElementPresent(registerPage.lastNameInput);
            const emailPresent = await webDriver.isElementPresent(registerPage.emailInput);
            const phonePresent = await webDriver.isElementPresent(registerPage.phoneInput);
            const passwordPresent = await webDriver.isElementPresent(registerPage.passwordInput);
            const addressPresent = await webDriver.isElementPresent(registerPage.addressInput);
            const pincodePresent = await webDriver.isElementPresent(registerPage.pincodeInput);
            const registerButtonPresent = await webDriver.isElementPresent(registerPage.registerButton);

            expect(firstNamePresent).to.be.true;
            expect(lastNamePresent).to.be.true;
            expect(emailPresent).to.be.true;
            expect(phonePresent).to.be.true;
            expect(passwordPresent).to.be.true;
            expect(addressPresent).to.be.true;
            expect(pincodePresent).to.be.true;
            expect(registerButtonPresent).to.be.true;
        });

        it('should display login link', async function () {
            const loginLinkPresent = await webDriver.isElementPresent(registerPage.loginLink);
            expect(loginLinkPresent).to.be.true;
        });
    });

    describe('Customer Registration', function () {

        it('should register a new customer with valid data', async function () {
            const customerData = TestDataGenerator.generateCustomerData();

            await registerPage.register(customerData);

            // Wait for response
            await webDriver.driver.sleep(2000);

            // Should either redirect or show success message
            const currentUrl = await webDriver.getCurrentUrl();
            const isSuccessDisplayed = await registerPage.isSuccessDisplayed();

            expect(currentUrl.includes('login') || isSuccessDisplayed).to.be.true;
        });

        it('should show error when registering with existing phone number', async function () {
            const customerData = TestDataGenerator.generateCustomerData();
            customerData.primaryPhone = config.users.customer.phone; // Use existing phone

            await registerPage.register(customerData);

            // Wait for error
            await webDriver.driver.sleep(1000);

            const isErrorDisplayed = await registerPage.isErrorDisplayed();
            expect(isErrorDisplayed).to.be.true;
        });
    });

    describe('Form Validation', function () {

        it('should not allow registration with empty fields', async function () {
            await registerPage.clickRegister();

            await webDriver.driver.sleep(500);

            // Should stay on registration page
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('register');
        });

        it('should validate email format', async function () {
            const customerData = TestDataGenerator.generateCustomerData();
            customerData.emailId = 'invalid-email';

            await registerPage.register(customerData);

            await webDriver.driver.sleep(1000);

            // Should show error or stay on page
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('register');
        });

        it('should validate phone number format', async function () {
            const customerData = TestDataGenerator.generateCustomerData();
            customerData.primaryPhone = '123'; // Invalid phone

            await registerPage.register(customerData);

            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('register');
        });
    });

    describe('Navigation', function () {

        it('should navigate to login page when clicking login link', async function () {
            await registerPage.clickLoginLink();

            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('login');
        });
    });
});
