# MilkMan - Milk Delivery Subscription Management System

A comprehensive milk delivery subscription management platform with Spring Boot backend, React web frontend, Android mobile app, and monitoring stack.

## 🏗️ Project Structure

```
MilkManApp/
├── middleware/           # Spring Boot 3.2.0 REST API (Java 17, port 8081)
├── android-app/          # Native Android app (Java 8, SDK 34)
├── web-app/              # React 18 + Vite 5 frontend (port 3001)
├── monitoring/           # Grafana + Prometheus observability stack
├── database/             # PostgreSQL 15 initialization scripts
├── dev-testing/          # Development test files and debug tools
└── docker-compose.yml    # Complete service orchestration
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- JDK 17 (for local middleware development)
- Node.js 18+ (for web development)
- Android Studio (for mobile development)

### Start All Services
```bash
docker-compose up -d
```

### Access Applications
- **Middleware API**: http://localhost:8081/milkman
- **Swagger UI**: http://localhost:8081/milkman/swagger-ui.html
- **Web Application**: http://localhost:3001
- **Grafana Dashboard**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

## 📦 Components

### Middleware (`/middleware`)
Spring Boot 3.2.0 REST API with JWT authentication and PostgreSQL database.

**Tech Stack**:
- Java 17, Spring Boot 3.2.0
- Jakarta EE, JWT Authentication (JJWT 0.12.3)
- PostgreSQL 15, JPA/Hibernate
- Lombok, SpringDoc OpenAPI 2.3.0
- Spring Actuator + Prometheus metrics

**Package Structure**:
```
com.app.milkman/
├── controller/    # REST endpoints
├── service/       # Business logic
├── repository/    # JPA data access
├── entity/        # Database models
├── model/         # DTOs
└── component/     # JWT, validation
```

**Run Locally**:
```bash
cd middleware
.\gradlew.bat bootRun     # Development mode
.\gradlew.bat build       # Build with tests
```

### Web Application (`/web-app`)
Modern React web frontend with responsive design and session management.

**Tech Stack**:
- React 18, Vite 5.4.21
- Tailwind CSS 3
- Axios (API client), React Router v6
- Session-based authentication (clears on browser close)

**Project Structure**:
```
web-app/src/
├── pages/         # Page components (Admin & Customer views)
├── components/    # Reusable UI components
├── context/       # Auth context & global state
├── hooks/         # Custom hooks (session timeout, activity tracking)
├── services/      # API service layer
└── dev-tools/     # Development & testing utilities
```

**Run Locally**:
```bash
cd web-app
npm install
npm run dev      # Dev server with proxy to localhost:8081
npm run build    # Production build
```

### Android App (`/android-app`)
Native Android application for customers and delivery personnel.

**Tech Stack**:
- Android SDK 34 (minSdk 24), Java 8
- Retrofit 2.6.2 for HTTP
- Material Design Components
- Navigation Components

**Package Structure**:
```
com.dreamfutureone.milkmanui/
├── ui/          # Activities & Fragments
├── data/        # Models & repositories
└── utils/       # Utilities & helpers
```

**Setup & Build**:
1. Create `local.properties` from template
2. Configure Android SDK path
```bash
cd android-app
.\gradlew.bat assembleDebug   # Debug APK
.\gradlew.bat clean build     # Full clean build
```

### Monitoring (`/monitoring`)
Complete observability stack with pre-configured dashboards.

**Services**:
- Grafana 11.4.0 (Visualization)
- Prometheus 3.1.0 (Metrics)
- cAdvisor (Container metrics)
- Node Exporter (System metrics)
- PostgreSQL Exporter (Database metrics)

**Features**:
- Application health status
- Container resource monitoring (CPU, Memory)
- Database connection pools
- HTTP request metrics
- System resource gauges

## 🗄️ Database

PostgreSQL 15 with `milkman` schema.

**Tables**:
- customers
- products
- orders
- subscriptions
- product_orders
- product_subscriptions

**Connection**:
- **Docker**: `postgres:5432` (container network)
- **Local**: `localhost:5433` (mapped port)
- Database: `milkman`
- User: `postgres`
- Password: `Welcome@1234`

## 🔧 Development

### Middleware Development
```bash
cd middleware
.\gradlew.bat build          # Build with tests
.\gradlew.bat build -x test  # Skip tests
.\gradlew.bat test           # Run tests only
.\gradlew.bat bootRun        # Local development server
```

**Test Database**: H2 in-memory with PostgreSQL compatibility mode

**Coverage**: JaCoCo reports in `build/reports/jacoco/`

### Web Development
```bash
cd web-app
npm run dev                  # Development server (port 3001)
npm run build                # Production build
npm run preview              # Preview production build

# Docker rebuild (when changing source)
docker-compose build --build-arg CACHEBUST=$(Get-Date -Format "yyyyMMddHHmmss") milkman-web
docker-compose up -d milkman-web
```

**Vite Proxy**: `/milkman` proxies to `http://localhost:8081/milkman` in development

### Android Development
Configure `local.properties`:
```properties
sdk.dir=C:\\Users\\<USER>\\AppData\\Local\\Android\\Sdk
```

Build:
```bash
cd android-app
.\gradlew.bat clean build
```

## 📊 Monitoring

Access Grafana at http://localhost:3000 (admin/admin).

**Dashboard Metrics**:
- **Application Status**: MilkMan API, PostgreSQL, Web App
- **Entity Counts**: Customers, Products, Orders, Subscriptions
- **Database**: Active/Idle connections
- **HTTP**: Requests per second
- **Containers**: CPU & Memory usage
- **System**: CPU%, Memory%, Disk%

## 🧪 Testing

### Middleware Tests
```bash
cd middleware
.\gradlew.bat test                      # Run all tests
.\gradlew.bat test --tests ClassName    # Specific test
.\gradlew.bat jacocoTestReport          # Generate coverage report
```

**Test Database**: H2 in-memory (`MODE=PostgreSQL` in JDBC URL)

**Coverage**: View `build/reports/jacoco/test/html/index.html`

### Manual Testing
Development test files located in `/dev-testing/`:
- HTML test pages for API endpoints
- PowerShell test scripts
- Debug tools and utilities

## 🐳 Docker

### Individual Services
```bash
docker-compose up -d postgres              # Database only
docker-compose up -d milkman-app          # Middleware API
docker-compose up -d milkman-web          # Web frontend
```

### Rebuild Services
```bash
# Rebuild web app (use CACHEBUST to avoid layer caching)
docker-compose build --build-arg CACHEBUST=$(Get-Date -Format "yyyyMMddHHmmss") milkman-web

# Rebuild middleware
docker-compose build milkman-app

# Rebuild all
docker-compose build --no-cache
```

### View Logs
```bash
docker-compose logs -f milkman-app        # Middleware logs
docker-compose logs -f milkman-web        # Web app logs
docker-compose logs -f postgres           # Database logs
```

### Stop All
```bash
docker-compose down                        # Stop containers
docker-compose down -v                     # Stop & remove volumes
```

## 🔐 Authentication

JWT-based authentication with dual-token pattern (JJWT 0.12.3).

**Token Types**:
- **Access Token**: 30 minutes validity
- **Refresh Token**: 7 days validity (auto-refresh on API calls)

**Storage**: sessionStorage (clears on browser/tab close for security)

**Flow**:
1. Login → Receive access + refresh tokens
2. Auto-refresh on 401 errors
3. Session timeout warnings (30 min inactivity)
4. Activity tracking resets timer

**Endpoints**:
- POST `/milkman/customer/authenticate` - Customer login
- POST `/milkman/admin/authenticate` - Admin login
- POST `/milkman/customer/register` - Customer registration

**Format**: `Authorization: Bearer <access_token>` header

**Roles**: `ADMIN`, `CUSTOMER`

## 📝 API Documentation

Interactive Swagger UI available at:
http://localhost:8081/milkman/swagger-ui.html

**Key Endpoints**:
- `/customer/*` - Customer management
- `/product/*` - Product operations
- `/order/*` - Order processing
- `/subscribe/*` - Subscription management

## 🏛️ Architecture

**Middleware**: 3-tier layered architecture
- **Controllers** - REST endpoints, extract JWT from headers
- **Services** - Business logic, use repositories
- **Repositories** - JPA data access
- **Entities** - JPA models (map to database tables)
- **DTOs** - Request/Response models (separate from entities)
- **Components** - JWT service, validators

**Database**: PostgreSQL 15 with `milkman` schema. Hibernate `ddl-auto: update` for schema management.

**Frontend**: Component-based React with Context API
- **Pages** - Admin and Customer route components
- **Components** - Reusable UI (Layout, ProtectedRoute, AdminRoute)
- **Context** - AuthContext for global authentication state
- **Hooks** - Session timeout, activity tracking, cleanup
- **Services** - Axios instance with interceptors (auto token refresh)

**Monitoring**: Prometheus scraping + Grafana visualization
- Spring Actuator metrics
- cAdvisor (container metrics)
- Node Exporter (system metrics)
- PostgreSQL Exporter (DB metrics)

## 🔄 Recent Updates (December 2025)

**Migration: Spring Boot 2.7 → 3.2**
- ✅ `javax.*` → `jakarta.*` packages
- ✅ JJWT 0.9.1 → 0.12.3 (modern builder API)
- ✅ SpringDoc OpenAPI 1.x → 2.3.0
- ✅ Deprecated method updates

**Security Enhancements**
- ✅ localStorage → sessionStorage (auto-clear on browser close)
- ✅ Dual-token JWT pattern (access + refresh)
- ✅ Session timeout warnings (30 min inactivity)
- ✅ Activity tracking hooks

**Code Organization**
- ✅ Test files moved to `/dev-testing/`
- ✅ Web dev tools in `/web-app/dev-tools/`
- ✅ Debug logging removed from production code
- ✅ Backup files cleaned up

**Features Added**
- ✅ Admin CRUD operations (Orders & Subscriptions)
- ✅ Customer home page with recent orders/subscriptions
- ✅ Edit/Delete functionality for admin pages
- ✅ Field name standardization (camelCase)

## 📞 Integration

**Twilio SMS**: Configured for notifications
- SDK 10.0.0
- Number verification
- Order/subscription updates

**Email**: Spring Mail with SMTP
- Gmail configuration
- Registration confirmations
- Password reset

**Android Backend**: Retrofit client
- Configured for emulator: `10.0.2.2:8081`
- Production: Configurable base URL

## 🚨 Common Issues & Solutions

**Port Conflicts**
- Middleware uses 8081 (not 8080)
- PostgreSQL on 5433 (not 5432)

**Docker Cache Issues**
- Use CACHEBUST arg when rebuilding
- `docker-compose build --build-arg CACHEBUST=$(Get-Date -Format "yyyyMMddHHmmss")`

**Browser Cache**
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache: DevTools → Network → Disable cache

**Session Not Ending**
- Verify sessionStorage (not localStorage) in browser DevTools
- Check token storage in Application tab

## 📁 Project Organization

```
MilkManApp/
├── .github/              # GitHub config & Copilot instructions
├── middleware/           # Spring Boot API
│   ├── src/
│   │   ├── main/java/com/app/milkman/
│   │   └── test/
│   ├── build.gradle
│   └── README.md
├── web-app/              # React frontend
│   ├── src/
│   │   ├── pages/        # Admin & Customer pages
│   │   ├── components/   # Reusable UI
│   │   ├── context/      # Global state
│   │   ├── hooks/        # Custom hooks
│   │   └── services/     # API layer
│   ├── dev-tools/        # Dev utilities
│   ├── package.json
│   └── vite.config.js
├── android-app/          # Android mobile app
│   ├── app/src/main/java/com/dreamfutureone/milkmanui/
│   ├── build.gradle
│   └── README.md
├── monitoring/           # Observability stack
│   ├── grafana/
│   ├── prometheus/
│   └── README.md
├── database/             # PostgreSQL scripts
│   ├── init-db.sql
│   └── Dockerfile
├── dev-testing/          # Development test files
│   ├── *.html            # API test pages
│   ├── *.ps1             # Test scripts
│   └── *.md              # Debug documentation
├── docker-compose.yml    # Service orchestration
└── README.md             # This file
```

## 📄 License

Proprietary - All rights reserved

## 👥 Contributors

- Backend: Spring Boot REST API
- Android: Mobile application
- Web: React frontend
- DevOps: Docker & monitoring stack

---

**Last Updated**: December 2025

