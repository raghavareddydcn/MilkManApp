const { By } = require('selenium-webdriver');

class RegisterPage {
    constructor(driver) {
        this.driver = driver;

        // Locators
        this.firstNameInput = By.css('input[name="firstName"], input[placeholder*="First"]');
        this.lastNameInput = By.css('input[name="lastName"], input[placeholder*="Last"]');
        this.emailInput = By.css('input[name="emailId"], input[name="email"], input[type="email"]');
        this.phoneInput = By.css('input[name="primaryPhone"], input[name="phone"], input[placeholder*="Phone"]');
        this.passwordInput = By.css('input[name="password"], input[type="password"]');
        this.addressInput = By.css('input[name="address"], textarea[name="address"]');
        this.pincodeInput = By.css('input[name="pinCode"], input[name="pincode"], input[placeholder*="Pin"]');
        this.registerButton = By.css('button[type="submit"], button:contains("Register"), button:contains("Sign Up")');
        this.loginLink = By.css('a[href*="login"], a:contains("Login"), a:contains("Sign In")');
        this.errorMessage = By.css('.error, .alert-danger, [class*="error"]');
        this.successMessage = By.css('.success, .alert-success, [class*="success"]');
    }

    async enterFirstName(firstName) {
        const element = await this.driver.findElement(this.firstNameInput);
        await element.clear();
        await element.sendKeys(firstName);
    }

    async enterLastName(lastName) {
        const element = await this.driver.findElement(this.lastNameInput);
        await element.clear();
        await element.sendKeys(lastName);
    }

    async enterEmail(email) {
        const element = await this.driver.findElement(this.emailInput);
        await element.clear();
        await element.sendKeys(email);
    }

    async enterPhone(phone) {
        const element = await this.driver.findElement(this.phoneInput);
        await element.clear();
        await element.sendKeys(phone);
    }

    async enterPassword(password) {
        const element = await this.driver.findElement(this.passwordInput);
        await element.clear();
        await element.sendKeys(password);
    }

    async enterAddress(address) {
        const element = await this.driver.findElement(this.addressInput);
        await element.clear();
        await element.sendKeys(address);
    }

    async enterPincode(pincode) {
        const element = await this.driver.findElement(this.pincodeInput);
        await element.clear();
        await element.sendKeys(pincode);
    }

    async clickRegister() {
        await this.driver.click(this.registerButton);
    }

    async register(customerData) {
        await this.enterFirstName(customerData.firstName);
        await this.enterLastName(customerData.lastName);
        await this.enterEmail(customerData.emailId);
        await this.enterPhone(customerData.primaryPhone);
        await this.enterPassword(customerData.password);
        await this.enterAddress(customerData.address);
        await this.enterPincode(customerData.pinCode);
        await this.clickRegister();
    }

    async clickLoginLink() {
        await this.driver.click(this.loginLink);
    }

    async getErrorMessage() {
        try {
            const element = await this.driver.findElement(this.errorMessage);
            return await element.getText();
        } catch (error) {
            return null;
        }
    }

    async getSuccessMessage() {
        try {
            const element = await this.driver.findElement(this.successMessage);
            return await element.getText();
        } catch (error) {
            return null;
        }
    }

    async isErrorDisplayed() {
        return await this.driver.isElementPresent(this.errorMessage);
    }

    async isSuccessDisplayed() {
        return await this.driver.isElementPresent(this.successMessage);
    }
}

module.exports = RegisterPage;
