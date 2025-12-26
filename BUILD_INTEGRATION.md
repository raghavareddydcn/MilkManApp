# Build Integration Guide

## 🎯 Overview

The automation tests are now fully integrated with the build process. Tests can be triggered automatically or manually using Gradle tasks.

## 🚀 Available Gradle Tasks

### 1. **Build with Automation Tests** (Recommended for CI/CD)
```bash
cd middleware
./gradlew buildWithAutomation
```
**What it does:**
- ✅ Runs unit tests
- ✅ Builds the application
- ✅ Generates code coverage report
- ✅ Runs API automation tests
- ✅ Runs UI automation tests
- ✅ Generates all test reports

**When to use:** Full validation before deployment

---

### 2. **Build with API Tests Only** (Faster)
```bash
cd middleware
./gradlew testWithApiAutomation
```
**What it does:**
- ✅ Runs unit tests
- ✅ Runs API automation tests (skips UI tests)
- ✅ Generates reports

**When to use:** Quick validation, API changes only

---

### 3. **Run Only Automation Tests**
```bash
cd middleware
./gradlew runAutomationTests
```
**What it does:**
- ✅ Installs automation test dependencies
- ✅ Runs API automation tests
- ✅ Runs UI automation tests
- ✅ Generates reports

**When to use:** Test existing build without rebuilding

---

### 4. **Run API Tests Only**
```bash
cd middleware
./gradlew runApiTests
```
**What it does:**
- ✅ Runs API automation tests only
- ✅ Generates API test report

**When to use:** Quick API validation

---

### 5. **Run UI Tests Only**
```bash
cd middleware
./gradlew runUiTests
```
**What it does:**
- ✅ Runs UI automation tests only
- ✅ Generates UI test report

**When to use:** UI-specific validation

---

### 6. **CI/CD Pipeline Task**
```bash
cd middleware
./gradlew cicdTest
```
**What it does:**
- ✅ Clean build
- ✅ Full build
- ✅ All automation tests
- ✅ Complete validation

**When to use:** CI/CD pipelines, release validation

---

## 📋 Prerequisites

Before running automation tests with Gradle:

1. **Node.js 18+** must be installed
   ```bash
   node --version
   ```

2. **Application must be running**
   ```bash
   docker-compose up -d
   ```

3. **Test users must exist** in database
   - Admin: Phone `9876543210`, Password `admin123`
   - Customer: Phone `9876543211`, Password `customer123`

---

## 🔄 Automatic Test Execution

### Option 1: Run Tests After Every Build (Automatic)

Edit `middleware/build.gradle` and uncomment this line:

```gradle
// Make build task run automation tests by default
build.finalizedBy runAutomationTests
```

Now every time you run `./gradlew build`, automation tests will run automatically!

### Option 2: Manual Trigger (Default)

By default, automation tests are NOT run automatically. You must explicitly run:
```bash
./gradlew buildWithAutomation
```

---

## 📊 Test Reports

After running tests, reports are generated in:

| Test Type | Report Location |
|-----------|----------------|
| Unit Tests | `middleware/build/reports/tests/test/index.html` |
| Code Coverage | `middleware/build/reports/jacoco/test/html/index.html` |
| API Tests | `automation-tests/reports/api/api-test-report.html` |
| UI Tests | `automation-tests/reports/ui/ui-test-report.html` |
| Screenshots | `automation-tests/reports/screenshots/` |

---

## 🎯 Typical Workflows

### Development Workflow
```bash
# 1. Make code changes
# 2. Run quick validation
cd middleware
./gradlew testWithApiAutomation

# 3. If API tests pass, run full validation
./gradlew buildWithAutomation
```

### Pre-Commit Workflow
```bash
# Run full validation before committing
cd middleware
./gradlew buildWithAutomation
```

### CI/CD Pipeline
```bash
# In your CI/CD pipeline
cd middleware
./gradlew cicdTest
```

### Quick API Check
```bash
# Just test APIs without rebuilding
cd middleware
./gradlew runApiTests
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in `automation-tests/` directory:

```env
# API Configuration
API_BASE_URL=http://localhost:8081/milkman
API_TIMEOUT=10000

# Web Configuration
WEB_BASE_URL=http://localhost:3001
WEB_TIMEOUT=30000

# Test Users
ADMIN_PHONE=9876543210
ADMIN_PASSWORD=admin123
CUSTOMER_PHONE=9876543211
CUSTOMER_PASSWORD=customer123

# Browser (for UI tests)
BROWSER=chrome
HEADLESS=false
```

### Gradle Properties

You can customize Gradle behavior in `gradle.properties`:

```properties
# Skip automation tests
skipAutomationTests=false

# Run tests in parallel
org.gradle.parallel=true
```

---

## 🐛 Troubleshooting

### Tests Not Running

**Problem:** Gradle says "Node.js not found"

**Solution:**
```bash
# Install Node.js 18+
# Windows: Download from https://nodejs.org/
# Linux: sudo apt install nodejs npm
# Mac: brew install node
```

---

### Application Not Running

**Problem:** Tests fail with "Connection refused"

**Solution:**
```bash
# Start the application first
docker-compose up -d

# Wait for it to be ready
curl http://localhost:8081/milkman/healthCheck

# Then run tests
cd middleware
./gradlew buildWithAutomation
```

---

### Test Dependencies Not Installing

**Problem:** npm install fails

**Solution:**
```bash
# Manually setup automation tests
cd automation-tests
npm install

# Then run Gradle tasks
cd ../middleware
./gradlew buildWithAutomation
```

---

### UI Tests Failing

**Problem:** Browser not launching

**Solution:**
```bash
# Run in headless mode
# Edit automation-tests/.env
HEADLESS=true

# Or skip UI tests
cd middleware
./gradlew testWithApiAutomation
```

---

## 📈 CI/CD Integration

### GitHub Actions

A complete workflow is provided in `.github/workflows/ci-cd.yml`

**Features:**
- ✅ Runs on push/PR to main/develop
- ✅ Sets up PostgreSQL database
- ✅ Builds application
- ✅ Runs all tests (unit + automation)
- ✅ Uploads test reports as artifacts
- ✅ Generates test summary

**To use:**
1. Push code to GitHub
2. Workflow runs automatically
3. View results in Actions tab
4. Download test reports from artifacts

### Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build & Test') {
            steps {
                sh 'cd middleware && ./gradlew cicdTest'
            }
        }
        
        stage('Publish Reports') {
            steps {
                publishHTML([
                    reportDir: 'automation-tests/reports/api',
                    reportFiles: 'api-test-report.html',
                    reportName: 'API Test Report'
                ])
                publishHTML([
                    reportDir: 'automation-tests/reports/ui',
                    reportFiles: 'ui-test-report.html',
                    reportName: 'UI Test Report'
                ])
            }
        }
    }
}
```

### GitLab CI

```yaml
test:
  script:
    - cd middleware
    - ./gradlew cicdTest
  artifacts:
    paths:
      - middleware/build/reports/
      - automation-tests/reports/
    expire_in: 1 week
```

---

## 🎯 Best Practices

1. **Run API tests first** (faster feedback)
   ```bash
   ./gradlew testWithApiAutomation
   ```

2. **Run full tests before merging**
   ```bash
   ./gradlew buildWithAutomation
   ```

3. **Use CI/CD task in pipelines**
   ```bash
   ./gradlew cicdTest
   ```

4. **Check reports after failures**
   - Unit tests: `build/reports/tests/test/index.html`
   - API tests: `../automation-tests/reports/api/api-test-report.html`
   - UI tests: `../automation-tests/reports/ui/ui-test-report.html`

5. **Keep .env updated** with correct test credentials

---

## 📝 Summary

| Command | Unit Tests | Build | API Tests | UI Tests | Use Case |
|---------|-----------|-------|-----------|----------|----------|
| `buildWithAutomation` | ✅ | ✅ | ✅ | ✅ | Full validation |
| `testWithApiAutomation` | ✅ | ❌ | ✅ | ❌ | Quick API check |
| `runAutomationTests` | ❌ | ❌ | ✅ | ✅ | Test existing build |
| `runApiTests` | ❌ | ❌ | ✅ | ❌ | API only |
| `runUiTests` | ❌ | ❌ | ❌ | ✅ | UI only |
| `cicdTest` | ✅ | ✅ | ✅ | ✅ | CI/CD pipeline |

---

**Your build is now fully integrated with automation tests! 🎉**

Every build can automatically validate your entire application with comprehensive test coverage.
