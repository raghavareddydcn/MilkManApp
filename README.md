# MilkMan - Milk Delivery Subscription Management System

A comprehensive milk delivery subscription management platform with Spring Boot backend, React web frontend, Android mobile app, and monitoring stack.

## 🏗️ Project Structure

```
MilkManApp/
├── backend/              # Spring Boot 3.2.0 REST API (Java 17)
├── android-app/          # Android mobile client (API 24+)
├── web-app/              # React 18 + Vite 5 web frontend
├── monitoring/           # Grafana + Prometheus monitoring stack
├── database/             # PostgreSQL initialization scripts
└── docker-compose.yml    # Complete orchestration
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- JDK 17 (for local backend development)
- Node.js 18+ (for web development)
- Android Studio (for mobile development)

### Start All Services
```bash
docker-compose up -d
```

### Access Applications
- **Backend API**: http://localhost:8081/milkman
- **Swagger UI**: http://localhost:8081/milkman/swagger-ui.html
- **Web Application**: http://localhost:3001
- **Grafana Dashboard**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

## 📦 Components

### Backend (`/backend`)
Spring Boot 3.2.0 REST API with PostgreSQL database.

**Tech Stack**:
- Java 17, Spring Boot 3.2.0
- Jakarta EE, JWT Authentication
- PostgreSQL 15, JPA/Hibernate
- Lombok, SpringDoc OpenAPI

**Run Locally**:
```bash
cd backend
.\gradlew.bat bootRun
```

### Web Application (`/web-app`)
Modern React web frontend with responsive design.

**Tech Stack**:
- React 18, Vite 5
- Tailwind CSS 3
- Axios, React Router

**Run Locally**:
```bash
cd web-app
npm install
npm run dev
```

### Android App (`/android-app`)
Native Android application for customers and delivery personnel.

**Tech Stack**:
- Android SDK 34, Java 8
- Retrofit 2.6.2
- Material Design, Navigation Components

**Build**:
```bash
cd android-app
.\gradlew.bat assembleDebug
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
- Host: `localhost:5433`
- Database: `milkman`
- User: `milkman`
- Password: `Welcome@1234`

## 🔧 Development

### Backend Development
```bash
cd backend
.\gradlew.bat build          # Build with tests
.\gradlew.bat build -x test  # Skip tests
.\gradlew.bat test           # Run tests
```

### Web Development
```bash
cd web-app
npm run dev                  # Development server
npm run build                # Production build
npm run preview              # Preview build
```

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

### Backend Tests
```bash
cd backend
.\run-tests.bat              # All working tests
.\quick-test.bat             # Unit tests only
.\generate-coverage.bat      # Coverage report
```

**Coverage**: JaCoCo configured, minimum 60% enforced.

### Test Database
H2 in-memory database for tests (configured in `src/test/resources/application.yml`).

## 🐳 Docker

### Individual Services
```bash
docker-compose up -d postgres           # Database only
docker-compose up -d backend            # Backend API
docker-compose up -d web-app            # Web frontend
docker-compose up -d monitoring         # Full monitoring stack
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f web-app
```

### Stop All
```bash
docker-compose down
```

## 🔐 Authentication

JWT-based authentication with modern JJWT 0.12.3 API.

**Endpoints**:
- POST `/milkman/authenticate` - Login
- POST `/milkman/register` - Registration

**Token Format**: Bearer token in Authorization header.

## 📝 API Documentation

Interactive Swagger UI available at:
http://localhost:8081/milkman/swagger-ui.html

**Key Endpoints**:
- `/customer/*` - Customer management
- `/product/*` - Product operations
- `/order/*` - Order processing
- `/subscribe/*` - Subscription management

## 🏛️ Architecture

**Backend**: Layered architecture
- Controllers (REST endpoints)
- Services (Business logic)
- Repositories (Data access)
- Entities (JPA models)
- DTOs (Request/Response models)

**Database**: PostgreSQL with schema management via SQL scripts.

**Frontend**: Component-based React architecture with context API for state management.

**Monitoring**: Prometheus scraping + Grafana visualization with multiple exporters.

## 🔄 Migration Notes

Recently migrated from Spring Boot 2.7 → 3.2:
- ✅ `javax.*` → `jakarta.*` packages
- ✅ JJWT 0.9.1 → 0.12.3 (modern API)
- ✅ SpringDoc OpenAPI 1.x → 2.3.0

## 📞 Integration

**Twilio SMS**: Configured for notifications (SDK 10.0.0)

**Email**: Spring Mail with Gmail SMTP

**Android Backend Communication**: Retrofit client configured for emulator (10.0.2.2:8081)

## 📄 License

Proprietary - All rights reserved

## 👥 Contributors

- Backend: Spring Boot REST API
- Android: Mobile application
- Web: React frontend
- DevOps: Docker & monitoring stack

---

**Last Updated**: December 2025
