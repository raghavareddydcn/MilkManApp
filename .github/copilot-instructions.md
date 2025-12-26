# MilkMan Project - AI Agent Instructions

## System Architecture

This is a **3-tier milk delivery subscription management system** with:
- **middleware/** - Spring Boot 3.2.0 REST API (Java 17, port 8081)
- **web-app/** - React 18 + Vite 5 frontend (port 3001)
- **android-app/** - Native Android app (Java 8, SDK 34)
- **database/** - PostgreSQL 15 with `milkman` schema (port 5433)
- **monitoring/** - Prometheus + Grafana observability stack (ports 3000/9090)

All services orchestrate via `docker-compose.yml` at the root. Services communicate through REST APIs with JWT authentication.

## Critical Development Workflows

### Running the Full Stack
```bash
# Start all services
docker-compose up -d

# Access points:
# API: http://localhost:8081/milkman
# Swagger: http://localhost:8081/milkman/swagger-ui.html
# Web UI: http://localhost:3001
# Grafana: http://localhost:3000 (admin/admin)
```

### Middleware (Spring Boot)
```bash
cd middleware
.\gradlew.bat bootRun                  # Local dev (connects to localhost:5433)
.\gradlew.bat build                    # Build with tests
.\gradlew.bat build -x test            # Skip tests
.\gradlew.bat test --tests ClassName   # Run specific test
```

**Package structure**: `com.app.milkman.{controller|service|repository|entity|component}`
- Uses H2 in-memory DB for tests (see [src/test/resources/application.yml](middleware/src/test/resources/application.yml))
- JaCoCo coverage reports in `build/reports/jacoco/`

### Web App (React + Vite)
```bash
cd web-app
npm run dev      # Dev server with proxy to http://milkman-app:8081/milkman
npm run build    # Production build
npm run preview  # Test production build
```

**API proxy**: Vite proxies `/milkman` to backend (see [vite.config.js](web-app/vite.config.js)). In Docker, it targets `milkman-app:8081`; locally targets `localhost:8081`.

**Key files**:
- [api.js](web-app/src/services/api.js) - Axios instance with interceptor pattern for token refresh
- [AuthContext.jsx](web-app/src/context/AuthContext.jsx) - Global auth state with activity tracking hooks

### Android App
```bash
cd android-app
.\gradlew.bat assembleDebug     # Build debug APK
.\gradlew.bat clean build       # Full clean build
```

**Required**: Create `local.properties` from `local.properties.template` with your Android SDK path.

## Authentication & Security

**JWT-based authentication** with dual-token pattern:
- **Access token**: 30 minutes validity
- **Refresh token**: 7 days validity (stored in `localStorage`)
- Tokens issued by [JWTService.java](middleware/src/main/java/com/app/milkman/component/JWTService.java)

**Frontend flow** ([api.js](web-app/src/services/api.js)):
- Axios interceptor adds `Authorization: Bearer <token>` header
- On 401, attempts auto-refresh using refresh token
- Queue failed requests during refresh to prevent duplicate requests
- Session timeout warnings via [AuthContext.jsx](web-app/context/AuthContext.jsx) hooks
- Activity tracking updates `lastActivity` in `localStorage` on user interaction

**Backend**: All controllers use `@RequestHeader("Authorization")` to extract and validate JWT.
**Role-based access**: `@RequireRole({"ADMIN"})` annotation restricts endpoints (see [CustomerController.java](middleware/src/main/java/com/app/milkman/controller/CustomerController.java#L54)).

## Database Conventions

**Schema**: All tables in `milkman` schema (PostgreSQL 15)

**Core tables**:
- `customers` - id (serial), customerid (varchar), auth_pin
- `products` - productid (PK), productname, productprice
- `orders` - orderid (PK), customerid (FK)
- `subscriptions` - subid (PK), customerid (FK), frequency
- `product_orders` / `product_subscriptions` - junction tables

**Connection**:
- **Docker**: `postgres:5432` (container network)
- **Local dev**: `localhost:5433` (mapped port)
- Credentials: `postgres` / `Welcome@1234` (see [application.yml](middleware/src/main/resources/application.yml))

**Schema management**: Hibernate `ddl-auto: update`. Initialization via [init-db.sql](database/init-db.sql).

## Project-Specific Patterns

### Middleware Layering
Standard Spring Boot 3-tier:
1. **Controllers** (`@RestController`) - Handle HTTP, extract JWT
2. **Services** (`@Service`) - Business logic, use repositories
3. **Repositories** (`@Repository`) - JPA data access

**DTOs**: Request/response models in `model/` package separate from JPA `entity/` classes.

### Web App State Management
- **Global auth**: [AuthContext.jsx](web-app/src/context/AuthContext.jsx) with React Context
- **Protected routes**: [ProtectedRoute.jsx](web-app/components/ProtectedRoute.jsx) wrapper checks auth
- **Activity tracking**: Custom hooks in `hooks/` for session timeout, cleanup, activity detection
  - `useActivityTracker` - Monitors user activity to reset session timer
  - `useSessionTimeout` - 30 min timeout with 2 min warning before expiry
  - `useSessionCleanup` - Clears session data on browser close

### API Response Format
Middleware returns consistent JSON:
```json
{
  "status": "success|error",
  "message": "...",
  "data": {...}
}
```

### Testing Approach
- **Unit tests**: Standard JUnit 5 + Mockito
- **Integration tests**: `@SpringBootTest` with H2 database
- **Controller tests**: `MockMvc` for REST endpoints
- Run all: `.\gradlew.bat test` from `middleware/`
- Coverage: Check `build/reports/jacoco/test/html/index.html`

## Monitoring & Observability

**Spring Boot Actuator** exposes `/actuator/prometheus` endpoint.

**Grafana dashboards** (pre-configured):
- Application health, HTTP metrics
- Container resources (cAdvisor)
- DB connection pools (postgres_exporter)
- System metrics (node_exporter)

Import dashboards via [import.ps1](monitoring/import.ps1) or manually from [dashboards/](monitoring/dashboards/).

## Common Gotchas

1. **Port conflicts**: Middleware uses 8081 (not 8080), PostgreSQL on 5433 (not 5432)
2. **CORS**: Web app uses proxy in dev; production needs CORS headers from backend
3. **Docker builds**: Services reference each other by container name (`milkman-app`, not `localhost`)
4. **Gradle wrapper**: Use `.\gradlew.bat` on Windows, not `gradle`
5. **Android SDK**: Must configure `local.properties` before building Android app
6. **Token refresh**: Failed requests are queued during refresh to prevent duplicate 401 errors
7. **Test database**: Tests use H2 with PostgreSQL compatibility mode (`MODE=PostgreSQL` in jdbc URL)

## Environment-Specific Configuration

### Middleware
- **Production** (Docker): `SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/milkman`
- **Local dev**: `jdbc:postgresql://localhost:5433/milkman` (see [application.yml](middleware/src/main/resources/application.yml))
- **Testing**: H2 in-memory with `schema.sql` (see [test application.yml](middleware/src/test/resources/application.yml))

### Web App
- **Docker**: `VITE_API_URL=http://milkman-app:8081/milkman` (container-to-container)
- **Local dev**: Vite proxy handles `/milkman` → `http://localhost:8081/milkman`

### Database Credentials
- User: `postgres`
- Password: `Welcome@1234`
- Database: `milkman`
- Schema: `milkman` (all tables prefixed)

## When Making Changes

- **Adding API endpoints**: Update controller → service → repository. Document in Swagger (OpenAPI annotations).
- **Schema changes**: Update `init-db.sql` and entity classes. Run `.\gradlew.bat test` to verify H2 compatibility.
- **Frontend routes**: Add to [App.jsx](web-app/src/App.jsx) routing, wrap with `ProtectedRoute` if auth required.
- **Dependencies**: Update [build.gradle](middleware/build.gradle) (Spring Boot) or [package.json](web-app/package.json) (React).
