const { By } = require('selenium-webdriver');

class ProductsPage {
    constructor(driver) {
        this.driver = driver;

        // Locators
        this.pageTitle = By.css('h1, h2, .page-title');
        this.productList = By.css('.product-list, [class*="product"], table tbody tr');
        this.productCard = By.css('.product-card, .product-item, [class*="product-card"]');
        this.addProductButton = By.css('button:contains("Add Product"), button:contains("New Product"), [class*="add-product"]');
        this.searchInput = By.css('input[type="search"], input[placeholder*="Search"]');
        this.productName = By.css('.product-name, [class*="product-name"], td:nth-child(1)');
        this.productPrice = By.css('.product-price, [class*="price"], td:nth-child(3)');
        this.editButton = By.css('button:contains("Edit"), [class*="edit"]');
        this.deleteButton = By.css('button:contains("Delete"), [class*="delete"]');
    }

    async isPageTitleDisplayed() {
        return await this.driver.isElementPresent(this.pageTitle);
    }

    async getPageTitle() {
        try {
            const element = await this.driver.findElement(this.pageTitle);
            return await element.getText();
        } catch (error) {
            return null;
        }
    }

    async getProductCount() {
        try {
            const products = await this.driver.findElements(this.productCard);
            return products.length;
        } catch (error) {
            return 0;
        }
    }

    async clickAddProduct() {
        await this.driver.click(this.addProductButton);
    }

    async searchProduct(searchTerm) {
        const element = await this.driver.findElement(this.searchInput);
        await element.clear();
        await element.sendKeys(searchTerm);
    }

    async isProductListDisplayed() {
        return await this.driver.isElementPresent(this.productList);
    }

    async getFirstProductName() {
        try {
            const element = await this.driver.findElement(this.productName);
            return await element.getText();
        } catch (error) {
            return null;
        }
    }

    async isAddProductButtonVisible() {
        return await this.driver.isElementPresent(this.addProductButton);
    }

    async waitForProductsToLoad() {
        await this.driver.waitForElement(this.productList, 10000);
    }
}

module.exports = ProductsPage;
