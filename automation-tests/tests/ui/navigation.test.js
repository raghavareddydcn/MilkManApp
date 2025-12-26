const { expect } = require('chai');
const WebDriver = require('../../utils/web-driver');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const config = require('../../config/test-config');

describe('Navigation and Routing UI Tests', function () {
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

    describe('Customer Navigation', function () {

        before(async function () {
            await webDriver.navigateTo('/login');
            await loginPage.login(config.users.customer.phone, config.users.customer.password);
            await webDriver.driver.sleep(2000);
        });

        it('should navigate to home page after login', async function () {
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.not.include('login');
        });

        it('should display customer navigation links', async function () {
            const isProductsVisible = await homePage.isProductsLinkVisible();
            const isOrdersVisible = await homePage.isOrdersLinkVisible();
            const isSubscriptionsVisible = await homePage.isSubscriptionsLinkVisible();

            expect(isProductsVisible).to.be.true;
            expect(isOrdersVisible).to.be.true;
            expect(isSubscriptionsVisible).to.be.true;
        });

        it('should not display admin-only links for customers', async function () {
            const isCustomersVisible = await homePage.isCustomersLinkVisible();
            expect(isCustomersVisible).to.be.false;
        });

        it('should navigate to products page', async function () {
            await homePage.clickProducts();
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('products');
        });

        it('should navigate to orders page', async function () {
            await homePage.clickOrders();
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('orders');
        });

        it('should navigate to subscriptions page', async function () {
            await homePage.clickSubscriptions();
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('subscriptions');
        });
    });

    describe('Admin Navigation', function () {

        before(async function () {
            // Logout and login as admin
            await webDriver.navigateTo('/login');
            await webDriver.driver.sleep(1000);
            await loginPage.login(config.users.admin.phone, config.users.admin.password);
            await webDriver.driver.sleep(2000);
        });

        it('should display admin navigation links', async function () {
            const isCustomersVisible = await homePage.isCustomersLinkVisible();
            const isProductsVisible = await homePage.isProductsLinkVisible();
            const isOrdersVisible = await homePage.isOrdersLinkVisible();
            const isSubscriptionsVisible = await homePage.isSubscriptionsLinkVisible();

            expect(isCustomersVisible).to.be.true;
            expect(isProductsVisible).to.be.true;
            expect(isOrdersVisible).to.be.true;
            expect(isSubscriptionsVisible).to.be.true;
        });

        it('should navigate to customers page', async function () {
            await homePage.clickCustomers();
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('customers');
        });

        it('should navigate to products page', async function () {
            await homePage.clickProducts();
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('products');
        });
    });

    describe('Logout Functionality', function () {

        it('should logout and redirect to login page', async function () {
            await homePage.clickLogout();
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('login');
        });

        it('should not access protected pages after logout', async function () {
            await webDriver.navigateTo('/products');
            await webDriver.driver.sleep(1000);

            const currentUrl = await webDriver.getCurrentUrl();
            // Should redirect to login
            expect(currentUrl).to.include('login');
        });
    });
});
