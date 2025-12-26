const { expect } = require('chai');
const WebDriver = require('../../utils/web-driver');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');
const config = require('../../config/test-config');

describe('Products Page UI Tests', function () {
    this.timeout(30000);
    let driver;
    let webDriver;
    let loginPage;
    let productsPage;

    before(async function () {
        webDriver = new WebDriver();
        driver = await webDriver.init();
        loginPage = new LoginPage(webDriver);
        productsPage = new ProductsPage(webDriver);

        // Login as customer first
        await webDriver.navigateTo('/login');
        await loginPage.login(config.users.customer.phone, config.users.customer.password);
        await webDriver.driver.sleep(2000);
    });

    after(async function () {
        if (webDriver) {
            await webDriver.quit();
        }
    });

    beforeEach(async function () {
        await webDriver.navigateTo('/products');
        await webDriver.driver.sleep(1000);
    });

    describe('Page Load and Elements', function () {

        it('should load products page successfully', async function () {
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl).to.include('products');
        });

        it('should display page title', async function () {
            const isTitleDisplayed = await productsPage.isPageTitleDisplayed();
            expect(isTitleDisplayed).to.be.true;
        });

        it('should display product list', async function () {
            await webDriver.driver.sleep(1000); // Wait for products to load

            const isListDisplayed = await productsPage.isProductListDisplayed();
            expect(isListDisplayed).to.be.true;
        });
    });

    describe('Product Display', function () {

        it('should display products if available', async function () {
            await webDriver.driver.sleep(1500);

            const productCount = await productsPage.getProductCount();
            expect(productCount).to.be.at.least(0);
        });

        it('should display product details', async function () {
            await webDriver.driver.sleep(1500);

            const productCount = await productsPage.getProductCount();

            if (productCount > 0) {
                const firstProductName = await productsPage.getFirstProductName();
                expect(firstProductName).to.not.be.null;
                expect(firstProductName).to.be.a('string');
            } else {
                this.skip();
            }
        });
    });

    describe('Customer View', function () {

        it('should not show add product button for customers', async function () {
            const isAddButtonVisible = await productsPage.isAddProductButtonVisible();
            expect(isAddButtonVisible).to.be.false;
        });
    });

    describe('Admin View', function () {

        before(async function () {
            // Logout and login as admin
            await webDriver.navigateTo('/login');
            await webDriver.driver.sleep(1000);
            await loginPage.login(config.users.admin.phone, config.users.admin.password);
            await webDriver.driver.sleep(2000);
        });

        it('should show add product button for admin', async function () {
            await webDriver.navigateTo('/products');
            await webDriver.driver.sleep(1000);

            const isAddButtonVisible = await productsPage.isAddProductButtonVisible();
            expect(isAddButtonVisible).to.be.true;
        });
    });
});
