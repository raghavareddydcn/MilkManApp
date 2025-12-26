# MilkMan Automation Test Suite

Comprehensive automation testing framework for the MilkMan application, covering both API and Web UI testing.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Reports](#reports)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This test automation suite provides comprehensive coverage for:
- **API Testing**: All REST endpoints (Authentication, Customers, Products, Orders, Subscriptions, Health Checks)
- **Web UI Testing**: All web pages and user workflows (Login, Registration, Navigation, Products, Orders, Subscriptions)

## ✨ Features

- ✅ **Complete API Coverage**: Tests for all 30+ API endpoints
- ✅ **Full UI Coverage**: Tests for all web pages and user journeys
- ✅ **Role-Based Testing**: Separate tests for Admin and Customer roles
- ✅ **Data-Driven**: Automated test data generation
- ✅ **Page Object Model**: Maintainable UI test architecture
- ✅ **Detailed Reporting**: HTML reports with mochawesome
- ✅ **Screenshot Capture**: Automatic screenshots on test failures
- ✅ **Parallel Execution**: Fast test execution
- ✅ **CI/CD Ready**: Easy integration with CI/CD pipelines

## 📦 Prerequisites

Before running the tests, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **Chrome Browser** (for UI tests)
   - Latest version recommended

3. **MilkMan Application Running**
   - API: http://localhost:8081/milkman
   - Web: http://localhost:3001
   
   Start the application:
   ```bash
   cd ../
   docker-compose up -d
   ```

4. **Test Data Setup**
   - Ensure database has test users:
     - Admin: Phone `9876543210`, Password `admin123`
     - Customer: Phone `9876543211`, Password `customer123`

## 🚀 Installation

1. **Navigate to automation-tests directory**
   ```bash
   cd automation-tests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment configuration**
   ```bash
   copy .env.example .env
   ```

4. **Edit `.env` file** with your configuration
   - Update test user credentials if different
   - Adjust URLs if running on different ports

## ⚙️ Configuration

Edit the `.env` file to configure:

```env
# API Configuration
API_BASE_URL=http://localhost:8081/milkman
API_TIMEOUT=10000

# Web Application Configuration
WEB_BASE_URL=http://localhost:3001
WEB_TIMEOUT=30000

# Test User Credentials
ADMIN_EMAIL=admin@milkman.com
ADMIN_PASSWORD=admin123
ADMIN_PHONE=9876543210

CUSTOMER_EMAIL=customer@test.com
CUSTOMER_PASSWORD=customer123
CUSTOMER_PHONE=9876543211

# Browser Configuration
BROWSER=chrome
HEADLESS=false
IMPLICIT_WAIT=10000
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run API Tests Only
```bash
npm run test:api
```

### Run UI Tests Only
```bash
npm run test:ui
```

### Run Specific Test Suite
```bash
# API Tests
npm run test:api:only

# UI Tests
npm run test:ui:only
```

### Run Individual Test Files
```bash
# Authentication API tests
npx mocha tests/api/auth.test.js

# Login UI tests
npx mocha tests/ui/login.test.js
```

### Generate Reports
```bash
npm run report
```

## 📁 Test Structure

```
automation-tests/
├── config/
│   └── test-config.js          # Centralized configuration
├── utils/
│   ├── api-client.js           # API client with all endpoints
│   ├── web-driver.js           # WebDriver utility wrapper
│   └── test-data-generator.js  # Test data generation
├── pages/                      # Page Object Models
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── HomePage.js
│   └── ProductsPage.js
├── tests/
│   ├── api/                    # API Tests
│   │   ├── auth.test.js
│   │   ├── customer.test.js
│   │   ├── product.test.js
│   │   ├── order.test.js
│   │   ├── subscription.test.js
│   │   └── health-check.test.js
│   └── ui/                     # UI Tests
│       ├── login.test.js
│       ├── register.test.js
│       ├── products.test.js
│       └── navigation.test.js
├── reports/                    # Test reports (generated)
│   ├── api/
│   ├── ui/
│   └── screenshots/
├── .env                        # Environment configuration
├── .env.example                # Environment template
├── package.json
└── README.md
```

## 📊 Test Coverage

### API Tests (6 Test Suites, 60+ Tests)

1. **Authentication API** (`auth.test.js`)
   - Customer authentication
   - Admin authentication
   - Token refresh
   - Invalid credentials handling

2. **Customer API** (`customer.test.js`)
   - Customer registration
   - Get all customers
   - Get customer by ID
   - Update customer
   - Delete customer
   - Authorization checks

3. **Product API** (`product.test.js`)
   - Product registration
   - Get all products
   - Update product
   - Pagination
   - Authorization checks

4. **Order API** (`order.test.js`)
   - Create order
   - Get all orders
   - Get orders by customer
   - Update order
   - Delete order

5. **Subscription API** (`subscription.test.js`)
   - Create subscription
   - Get all subscriptions
   - Get subscriptions by customer
   - Update subscription
   - Delete subscription
   - Frequency variations (DAILY, WEEKLY, MONTHLY)

6. **Health Check API** (`health-check.test.js`)
   - Basic health check
   - SMS test endpoint
   - Email test endpoint
   - Encryption/Decryption
   - API availability

### UI Tests (4 Test Suites, 30+ Tests)

1. **Login Page** (`login.test.js`)
   - Page load and elements
   - Customer login
   - Admin login
   - Form validation
   - Error handling

2. **Registration Page** (`register.test.js`)
   - Page load and elements
   - Customer registration
   - Form validation
   - Duplicate user handling

3. **Products Page** (`products.test.js`)
   - Page load and product display
   - Customer view
   - Admin view
   - Role-based access

4. **Navigation** (`navigation.test.js`)
   - Customer navigation
   - Admin navigation
   - Logout functionality
   - Protected routes

## 📈 Reports

After running tests, reports are generated in the `reports/` directory:

- **API Reports**: `reports/api/api-test-report.html`
- **UI Reports**: `reports/ui/ui-test-report.html`
- **Screenshots**: `reports/screenshots/` (on failures)

Open the HTML reports in a browser to view:
- Test execution summary
- Pass/Fail statistics
- Detailed test results
- Execution time
- Error messages and stack traces

## 🔍 Troubleshooting

### Tests Failing to Connect

**Problem**: Tests cannot connect to API or Web application

**Solution**:
1. Ensure Docker containers are running:
   ```bash
   docker-compose ps
   ```
2. Check if services are accessible:
   ```bash
   curl http://localhost:8081/milkman/healthCheck
   curl http://localhost:3001
   ```
3. Verify `.env` configuration has correct URLs

### Authentication Tests Failing

**Problem**: Login tests fail with 401/403 errors

**Solution**:
1. Verify test user credentials in `.env`
2. Check if users exist in database
3. Ensure passwords are correct
4. Check JWT token configuration in middleware

### UI Tests Not Running

**Problem**: Browser doesn't launch or tests timeout

**Solution**:
1. Ensure Chrome browser is installed
2. Update chromedriver:
   ```bash
   npm install chromedriver@latest
   ```
3. Try running in headless mode:
   ```env
   HEADLESS=true
   ```
4. Increase timeout in `.env`:
   ```env
   WEB_TIMEOUT=60000
   ```

### Element Not Found Errors

**Problem**: UI tests fail with "element not found"

**Solution**:
1. Increase implicit wait time
2. Check if page selectors match actual HTML
3. Ensure page has fully loaded before interaction
4. Update page object locators if UI changed

### Database Connection Issues

**Problem**: Tests fail due to database errors

**Solution**:
1. Ensure PostgreSQL container is running
2. Verify database connection in middleware
3. Check if test data exists
4. Run database initialization scripts

## 🎯 Best Practices

1. **Run tests in order**: API tests → UI tests
2. **Clean test data**: Delete created test data after tests
3. **Use unique test data**: Avoid conflicts with existing data
4. **Check application logs**: Review middleware logs for errors
5. **Update selectors**: Keep page objects updated with UI changes
6. **Run locally first**: Test locally before CI/CD integration

## 🔄 Continuous Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run API Tests
  run: |
    cd automation-tests
    npm install
    npm run test:api

- name: Run UI Tests
  run: |
    cd automation-tests
    npm run test:ui

- name: Upload Reports
  uses: actions/upload-artifact@v2
  with:
    name: test-reports
    path: automation-tests/reports/
```

## 📝 Adding New Tests

### Adding API Tests

1. Create new test file in `tests/api/`
2. Import API client and utilities
3. Write test cases using Mocha/Chai
4. Use test data generator for dynamic data

### Adding UI Tests

1. Create page object in `pages/` (if needed)
2. Create test file in `tests/ui/`
3. Import WebDriver and page objects
4. Write test cases with proper waits

## 🤝 Contributing

When adding new tests:
1. Follow existing code structure
2. Use descriptive test names
3. Add proper assertions
4. Include error handling
5. Update this README

## 📄 License

Proprietary - All rights reserved

---

**Last Updated**: December 2025

For questions or issues, contact the MilkMan development team.
