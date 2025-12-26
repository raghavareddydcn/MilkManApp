const { By } = require('selenium-webdriver');

class LoginPage {
    constructor(driver) {
        this.driver = driver;

        // Locators
        this.emailOrPhoneInput = By.css('input[type="text"], input[name="emailOrPhone"], input[placeholder*="Email"], input[placeholder*="Phone"]');
        this.passwordInput = By.css('input[type="password"], input[name="password"]');
        this.loginButton = By.css('button[type="submit"], button:contains("Login"), button:contains("Sign In")');
        this.registerLink = By.css('a[href*="register"], a:contains("Register"), a:contains("Sign Up")');
        this.errorMessage = By.css('.error, .alert-danger, [class*="error"]');
        this.successMessage = By.css('.success, .alert-success, [class*="success"]');
    }

    async enterEmailOrPhone(emailOrPhone) {
        const element = await this.driver.findElement(this.emailOrPhoneInput);
        await element.clear();
        await element.sendKeys(emailOrPhone);
    }

    async enterPassword(password) {
        const element = await this.driver.findElement(this.passwordInput);
        await element.clear();
        await element.sendKeys(password);
    }

    async clickLogin() {
        await this.driver.click(this.loginButton);
    }

    async login(emailOrPhone, password) {
        await this.enterEmailOrPhone(emailOrPhone);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    async clickRegisterLink() {
        await this.driver.click(this.registerLink);
    }

    async getErrorMessage() {
        try {
            const element = await this.driver.findElement(this.errorMessage);
            return await element.getText();
        } catch (error) {
            return null;
        }
    }

    async isErrorDisplayed() {
        return await this.driver.isElementPresent(this.errorMessage);
    }

    async waitForRedirect(timeout = 5000) {
        await this.driver.driver.sleep(timeout);
    }
}

module.exports = LoginPage;
