require('dotenv').config();

module.exports = {
  api: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:8081/milkman',
    timeout: parseInt(process.env.API_TIMEOUT) || 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  web: {
    baseURL: process.env.WEB_BASE_URL || 'http://localhost:3001',
    timeout: parseInt(process.env.WEB_TIMEOUT) || 30000
  },
  
  browser: {
    name: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS === 'true',
    implicitWait: parseInt(process.env.IMPLICIT_WAIT) || 10000
  },
  
  users: {
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@milkman.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: process.env.ADMIN_PHONE || '9876543210'
    },
    customer: {
      email: process.env.CUSTOMER_EMAIL || 'customer@test.com',
      password: process.env.CUSTOMER_PASSWORD || 'customer123',
      phone: process.env.CUSTOMER_PHONE || '9876543211'
    }
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || 'milkman',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Welcome@1234'
  },
  
  test: {
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
    videoRecording: process.env.VIDEO_RECORDING === 'true',
    retryFailedTests: parseInt(process.env.RETRY_FAILED_TESTS) || 2
  }
};
