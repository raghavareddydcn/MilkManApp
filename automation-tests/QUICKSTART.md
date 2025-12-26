# Quick Start Guide - MilkMan Automation Tests

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites Check
```powershell
# Check Node.js version (should be 18+)
node --version

# Check if MilkMan app is running
curl http://localhost:8081/milkman/healthCheck
curl http://localhost:3001
```

### Step 2: Install Dependencies
```powershell
cd automation-tests
npm install
```

### Step 3: Configure Environment
```powershell
# Copy environment template
copy .env.example .env

# Edit .env file if needed (optional - defaults work for local setup)
notepad .env
```

### Step 4: Run Tests

**Option A: Run All Tests**
```powershell
npm test
```

**Option B: Run API Tests Only (Faster)**
```powershell
npm run test:api
```

**Option C: Run UI Tests Only**
```powershell
npm run test:ui
```

### Step 5: View Reports
```powershell
npm run report
```

Then open the HTML reports in your browser:
- API Report: `reports/api/api-test-report.html`
- UI Report: `reports/ui/ui-test-report.html`

## 📋 Test Data Requirements

Before running tests, ensure these test users exist in your database:

### Admin User
- Phone: `9876543210`
- Password: `admin123`
- Role: `ADMIN`

### Customer User
- Phone: `9876543211`
- Password: `customer123`
- Role: `CUSTOMER`

## 🔧 Troubleshooting

### Application Not Running
```powershell
cd ..
docker-compose up -d
docker-compose ps
```

### Tests Failing
1. Check application logs:
   ```powershell
   docker-compose logs milkman-app
   docker-compose logs milkman-web
   ```

2. Verify test users exist in database

3. Check `.env` configuration

### Browser Issues (UI Tests)
```powershell
# Update ChromeDriver
npm install chromedriver@latest

# Or run in headless mode
# Edit .env: HEADLESS=true
```

## 📊 What Gets Tested

### API Tests (60+ tests)
- ✅ Authentication (Login, Token Refresh)
- ✅ Customer Management (CRUD operations)
- ✅ Product Management (CRUD operations)
- ✅ Order Management (CRUD operations)
- ✅ Subscription Management (CRUD operations)
- ✅ Health Checks & Utilities

### UI Tests (30+ tests)
- ✅ Login Page (Customer & Admin)
- ✅ Registration Page
- ✅ Products Page (Customer & Admin views)
- ✅ Navigation & Routing
- ✅ Role-Based Access Control
- ✅ Form Validation

## 🎯 Next Steps

1. **Review Test Results**: Check the HTML reports
2. **Add Custom Tests**: See `README.md` for adding new tests
3. **Integrate with CI/CD**: Use the test scripts in your pipeline
4. **Customize Configuration**: Adjust `.env` for your environment

## 📚 Documentation

For detailed documentation, see:
- `README.md` - Complete documentation
- `config/test-config.js` - Configuration options
- `tests/api/` - API test examples
- `tests/ui/` - UI test examples

## 💡 Tips

- Run API tests first (they're faster)
- Use `--grep` to run specific tests:
  ```powershell
  npx mocha tests/api/**/*.test.js --grep "authentication"
  ```
- Check screenshots in `reports/screenshots/` on failures
- Update test data in `.env` if using different credentials

---

**Need Help?** Check the full README.md or contact the development team.
