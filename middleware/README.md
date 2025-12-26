# MilkMan Middleware - Spring Boot REST API

Backend REST API for MilkMan delivery subscription management system.

## Tech Stack

- **Java 17** with Spring Boot 3.2.0
- **Jakarta EE** (migrated from javax.*)
- **JWT Authentication** with JJWT 0.12.3
- **PostgreSQL 15** with JPA/Hibernate
- **SpringDoc OpenAPI 2.3.0** for API documentation
- **Spring Actuator** for metrics & health checks
- **Lombok** for boilerplate reduction

## Package Structure

```
com.app.milkman/
├── controller/     # REST endpoints (@RestController)
├── service/        # Business logic (@Service)
├── repository/     # JPA repositories (@Repository)
├── entity/         # Database entities (@Entity)
├── model/          # Request/Response DTOs
└── component/      # JWT service, validators
```

## Quick Start

### Local Development
```bash
# Run application (connects to localhost:5433)
.\gradlew.bat bootRun

# Build with tests
.\gradlew.bat build

# Skip tests
.\gradlew.bat build -x test

# Run specific test
.\gradlew.bat test --tests ClassName
```

### Docker
```bash
cd ..
docker-compose up -d milkman-app
```

## Configuration

### Database
- **Production** (Docker): `jdbc:postgresql://postgres:5432/milkman`
- **Local Dev**: `jdbc:postgresql://localhost:5433/milkman`
- **Testing**: H2 in-memory with PostgreSQL mode

Credentials: `postgres` / `Welcome@1234`

### Ports
- **API**: 8081
- **Actuator**: 8081/actuator
- **Prometheus**: 8081/actuator/prometheus

## API Documentation

Swagger UI: http://localhost:8081/milkman/swagger-ui.html

### Key Endpoints

**Authentication**
- `POST /milkman/customer/authenticate` - Customer login
- `POST /milkman/admin/authenticate` - Admin login
- `POST /milkman/customer/register` - Registration

**Customers**
- `GET /milkman/customer` - Get all customers
- `POST /milkman/customer` - Create customer
- `PUT /milkman/customer` - Update customer
- `DELETE /milkman/customer/{id}` - Delete customer

**Products**
- `GET /milkman/product` - Get all products
- `POST /milkman/product` - Create product
- `PUT /milkman/product` - Update product
- `DELETE /milkman/product/{id}` - Delete product

**Orders**
- `GET /milkman/order` - Get all orders
- `POST /milkman/order` - Create order
- `PUT /milkman/order` - Update order
- `DELETE /milkman/order/{id}` - Delete order

**Subscriptions**
- `GET /milkman/subscribe` - Get all subscriptions
- `POST /milkman/subscribe` - Create subscription
- `PUT /milkman/subscribe` - Update subscription
- `DELETE /milkman/subscribe/{id}` - Delete subscription

## Authentication

JWT-based with dual-token pattern:
- **Access Token**: 30 minutes validity
- **Refresh Token**: 7 days validity

All endpoints (except login/register) require:
```
Authorization: Bearer <access_token>
```

Role-based access control:
- `ADMIN` - Full access to all endpoints
- `CUSTOMER` - Limited to customer-specific operations

## Testing

### Run Tests
```bash
.\gradlew.bat test
```

### Generate Coverage Report
```bash
.\gradlew.bat jacocoTestReport
# View: build/reports/jacoco/test/html/index.html
```

### Test Database
Tests use H2 in-memory database with PostgreSQL compatibility mode.
Configuration: `src/test/resources/application.yml`

## Building

### Local Build
```bash
.\gradlew.bat clean build
# Output: build/libs/MilkMan-0.0.1-SNAPSHOT.jar
```

### Docker Build
```bash
cd ..
docker-compose build milkman-app
```

## Monitoring

Spring Actuator endpoints:
- `/actuator/health` - Health status
- `/actuator/prometheus` - Prometheus metrics
- `/actuator/info` - Application info

Metrics scraped by Prometheus and visualized in Grafana.

## See Also

- [Main Project README](../README.md)
- [API Documentation](http://localhost:8081/milkman/swagger-ui.html)
- [Grafana Dashboard](http://localhost:3000)
