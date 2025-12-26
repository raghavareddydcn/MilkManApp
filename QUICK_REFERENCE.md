# 🚀 Quick Reference - Build & Test Commands

## One-Line Commands

```bash
# FULL BUILD + ALL TESTS (Recommended for CI/CD)
cd middleware && ./gradlew buildWithAutomation

# QUICK API VALIDATION (Fastest)
cd middleware && ./gradlew testWithApiAutomation

# CI/CD PIPELINE
cd middleware && ./gradlew cicdTest

# JUST AUTOMATION TESTS (No rebuild)
cd middleware && ./gradlew runAutomationTests
```

---

## Step-by-Step Workflow

### First Time Setup
```bash
# 1. Start application
docker-compose up -d

# 2. Wait for ready
curl http://localhost:8081/milkman/healthCheck

# 3. Run full build with tests
cd middleware
./gradlew buildWithAutomation
```

### Daily Development
```bash
# Make changes → Quick validation
cd middleware
./gradlew testWithApiAutomation

# If passed → Full validation
./gradlew buildWithAutomation
```

### Before Commit
```bash
cd middleware
./gradlew buildWithAutomation
```

---

## Test Reports

After running tests, open these files in browser:

```
📊 Unit Tests:      middleware/build/reports/tests/test/index.html
📊 Code Coverage:   middleware/build/reports/jacoco/test/html/index.html
📊 API Tests:       automation-tests/reports/api/api-test-report.html
📊 UI Tests:        automation-tests/reports/ui/ui-test-report.html
```

---

## Gradle Tasks Reference

| Task | What It Does | Time |
|------|-------------|------|
| `buildWithAutomation` | Build + Unit + API + UI tests | ~10 min |
| `testWithApiAutomation` | Unit + API tests only | ~5 min |
| `runAutomationTests` | API + UI tests (no build) | ~8 min |
| `runApiTests` | API tests only | ~3 min |
| `runUiTests` | UI tests only | ~6 min |
| `cicdTest` | Clean + Build + All tests | ~12 min |

---

## Troubleshooting Quick Fixes

```bash
# Application not running?
docker-compose up -d

# Node.js not found?
# Install from https://nodejs.org/

# Tests failing?
# Check application logs
docker-compose logs milkman-app

# Clean everything and retry
cd middleware
./gradlew clean buildWithAutomation
```

---

## CI/CD Integration

### GitHub Actions
- Workflow file: `.github/workflows/ci-cd.yml`
- Runs automatically on push/PR
- View results in Actions tab

### Manual CI/CD Command
```bash
cd middleware
./gradlew cicdTest
```

---

## Environment Setup

```bash
# Copy environment template
cd automation-tests
cp .env.example .env

# Edit if needed (optional)
notepad .env
```

---

**For detailed documentation, see:**
- `BUILD_INTEGRATION.md` - Complete build integration guide
- `automation-tests/README.md` - Automation tests documentation
- `automation-tests/QUICKSTART.md` - 5-minute setup guide
