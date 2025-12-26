const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/test-config');
const fs = require('fs');
const path = require('path');

class WebDriver {
    constructor() {
        this.driver = null;
        this.baseURL = config.web.baseURL;
        this.timeout = config.web.timeout;
    }

    /**
     * Initialize WebDriver
     */
    async init() {
        const options = new chrome.Options();

        if (config.browser.headless) {
            options.addArguments('--headless');
        }

        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');

        this.driver = await new Builder()
            .forBrowser(config.browser.name)
            .setChromeOptions(options)
            .build();

        await this.driver.manage().setTimeouts({
            implicit: config.browser.implicitWait
        });

        return this.driver;
    }

    /**
     * Navigate to URL
     */
    async navigateTo(path = '') {
        const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
        await this.driver.get(url);
        await this.waitForPageLoad();
    }

    /**
     * Wait for page to load
     */
    async waitForPageLoad() {
        await this.driver.wait(async () => {
            const readyState = await this.driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, this.timeout);
    }

    /**
     * Find element
     */
    async findElement(locator) {
        return await this.driver.wait(until.elementLocated(locator), this.timeout);
    }

    /**
     * Find elements
     */
    async findElements(locator) {
        return await this.driver.findElements(locator);
    }

    /**
     * Click element
     */
    async click(locator) {
        const element = await this.findElement(locator);
        await this.driver.wait(until.elementIsVisible(element), this.timeout);
        await this.driver.wait(until.elementIsEnabled(element), this.timeout);
        await element.click();
    }

    /**
     * Type text
     */
    async type(locator, text) {
        const element = await this.findElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }

    /**
     * Get text
     */
    async getText(locator) {
        const element = await this.findElement(locator);
        return await element.getText();
    }

    /**
     * Get attribute
     */
    async getAttribute(locator, attribute) {
        const element = await this.findElement(locator);
        return await element.getAttribute(attribute);
    }

    /**
     * Wait for element
     */
    async waitForElement(locator, timeout = this.timeout) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    /**
     * Wait for element to be visible
     */
    async waitForVisible(locator, timeout = this.timeout) {
        const element = await this.findElement(locator);
        return await this.driver.wait(until.elementIsVisible(element), timeout);
    }

    /**
     * Wait for element to be invisible
     */
    async waitForInvisible(locator, timeout = this.timeout) {
        const element = await this.findElement(locator);
        return await this.driver.wait(until.elementIsNotVisible(element), timeout);
    }

    /**
     * Check if element exists
     */
    async isElementPresent(locator) {
        try {
            await this.driver.findElement(locator);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Execute JavaScript
     */
    async executeScript(script, ...args) {
        return await this.driver.executeScript(script, ...args);
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(filename) {
        const screenshotDir = path.join(__dirname, '../reports/screenshots');

        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshot = await this.driver.takeScreenshot();
        const filepath = path.join(screenshotDir, `${filename}.png`);
        fs.writeFileSync(filepath, screenshot, 'base64');

        return filepath;
    }

    /**
     * Get current URL
     */
    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }

    /**
     * Get page title
     */
    async getTitle() {
        return await this.driver.getTitle();
    }

    /**
     * Refresh page
     */
    async refresh() {
        await this.driver.navigate().refresh();
        await this.waitForPageLoad();
    }

    /**
     * Go back
     */
    async goBack() {
        await this.driver.navigate().back();
        await this.waitForPageLoad();
    }

    /**
     * Go forward
     */
    async goForward() {
        await this.driver.navigate().forward();
        await this.waitForPageLoad();
    }

    /**
     * Switch to frame
     */
    async switchToFrame(locator) {
        const frame = await this.findElement(locator);
        await this.driver.switchTo().frame(frame);
    }

    /**
     * Switch to default content
     */
    async switchToDefaultContent() {
        await this.driver.switchTo().defaultContent();
    }

    /**
     * Accept alert
     */
    async acceptAlert() {
        const alert = await this.driver.switchTo().alert();
        await alert.accept();
    }

    /**
     * Dismiss alert
     */
    async dismissAlert() {
        const alert = await this.driver.switchTo().alert();
        await alert.dismiss();
    }

    /**
     * Get alert text
     */
    async getAlertText() {
        const alert = await this.driver.switchTo().alert();
        return await alert.getText();
    }

    /**
     * Quit driver
     */
    async quit() {
        if (this.driver) {
            await this.driver.quit();
            this.driver = null;
        }
    }
}

module.exports = WebDriver;
