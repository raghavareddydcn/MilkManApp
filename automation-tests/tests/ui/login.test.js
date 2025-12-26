const { expect } = require('chai');
const WebDriver = require('../../utils/web-driver');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const config = require('../../config/test-config');

describe('Login Page UI Tests', function () {
    this.timeout(30000);
    let driver;
    let webDriver;
    let loginPage;
    let homePage;

    before(async function () {
        webDriver = new WebDriver();
        driver = await webDriver.init();
        loginPage = new LoginPage(webDriver);
        homePage = new HomePage(webDriver);
    });

    after(async function () {
        if (webDriver) {
            await webDriver.quit();
        }
    });

    beforeEach(async function () {
        await webDriver.navigateTo('/login');
    });

    describe('Page Load and Elements', function () {

        it('should load login page successfully', async function () {
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('login');
        });

        it('should display login form elements', async function () {
            const emailInputPresent = await webDriver.isElementPresent(loginPage.emailOrPhoneInput);
            const passwordInputPresent = await webDriver.isElementPresent(loginPage.passwordInput);
            const loginButtonPresent = await webDriver.isElementPresent(loginPage.loginButton);

            expect(emailInputPresent).to.be.true;
            expect(passwordInputPresent).to.be.true;
            expect(loginButtonPresent).to.be.true;
        });

        it('should display register link', async function () {
            const registerLinkPresent = await webDriver.isElementPresent(loginPage.registerLink);
            expect(registerLinkPresent).to.be.true;
        });
    });

    describe('Customer Login', function () {

        it('should login successfully with valid customer credentials', async function () {
            await loginPage.login(config.users.customer.phone, config.users.customer.password);

            // Wait for redirect
            await webDriver.driver.sleep(2000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.not.include('login');
        });

        it('should show error with invalid credentials', async function () {
            await loginPage.login('9999999999', 'wrongpassword');

            // Wait for error message
            await webDriver.driver.sleep(1000);

            const isErrorDisplayed = await loginPage.isErrorDisplayed();
            expect(isErrorDisplayed).to.be.true;
        });

        it('should show error with empty credentials', async function () {
            await loginPage.clickLogin();

            // Wait for validation
            await webDriver.driver.sleep(500);

            // Form validation should prevent submission or show error
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('login');
        });
    });

    describe('Admin Login', function () {

        it('should login successfully with valid admin credentials', async function () {
            await loginPage.login(config.users.admin.phone, config.users.admin.password);

            // Wait for redirect
            await webDriver.driver.sleep(2000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.not.include('login');
        });
    });

    describe('Navigation', function () {

        it('should navigate to register page when clicking register link', async function () {
            await loginPage.clickRegisterLink();

            // Wait for navigation
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('register');
        });
    });

    describe('Form Validation', function () {

        it('should not allow login with only email/phone filled', async function () {
            await loginPage.enterEmailOrPhone(config.users.customer.phone);
            await loginPage.clickLogin();

            await webDriver.driver.sleep(500);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('login');
        });

        it('should not allow login with only password filled', async function () {
            await loginPage.enterPassword(config.users.customer.password);
            await loginPage.clickLogin();

            await webDriver.driver.sleep(500);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('login');
        });
    });
});
