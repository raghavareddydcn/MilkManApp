const { By } = require('selenium-webdriver');

class HomePage {
    constructor(driver) {
        this.driver = driver;

        // Locators
        this.welcomeMessage = By.css('h1, .welcome, [class*="welcome"]');
        this.productsLink = By.css('a[href*="products"], nav a:contains("Products")');
        this.ordersLink = By.css('a[href*="orders"], nav a:contains("Orders")');
        this.subscriptionsLink = By.css('a[href*="subscriptions"], nav a:contains("Subscriptions")');
        this.profileLink = By.css('a[href*="profile"], nav a:contains("Profile")');
        this.logoutButton = By.css('button:contains("Logout"), a:contains("Logout"), [class*="logout"]');
        this.customersLink = By.css('a[href*="customers"], nav a:contains("Customers")'); // Admin only
        this.dashboardLink = By.css('a[href*="dashboard"], nav a:contains("Dashboard")');
    }

    async isWelcomeMessageDisplayed() {
        return await this.driver.isElementPresent(this.welcomeMessage);
    }

    async getWelcomeMessage() {
        try {
            const element = await this.driver.findElement(this.welcomeMessage);
            return await element.getText();
        } catch (error) {
            return null;
        }
    }

    async clickProducts() {
        await this.driver.click(this.productsLink);
    }

    async clickOrders() {
        await this.driver.click(this.ordersLink);
    }

    async clickSubscriptions() {
        await this.driver.click(this.subscriptionsLink);
    }

    async clickProfile() {
        await this.driver.click(this.profileLink);
    }

    async clickLogout() {
        await this.driver.click(this.logoutButton);
    }

    async clickCustomers() {
        await this.driver.click(this.customersLink);
    }

    async clickDashboard() {
        await this.driver.click(this.dashboardLink);
    }

    async isProductsLinkVisible() {
        return await this.driver.isElementPresent(this.productsLink);
    }

    async isOrdersLinkVisible() {
        return await this.driver.isElementPresent(this.ordersLink);
    }

    async isSubscriptionsLinkVisible() {
        return await this.driver.isElementPresent(this.subscriptionsLink);
    }

    async isCustomersLinkVisible() {
        return await this.driver.isElementPresent(this.customersLink);
    }

    async waitForPageLoad() {
        await this.driver.waitForPageLoad();
    }
}

module.exports = HomePage;
