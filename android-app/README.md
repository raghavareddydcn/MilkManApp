# MilkManUI - Android Mobile Application

Native Android application for MilkMan delivery subscription management system.

## Tech Stack

- **Language**: Java 8
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Build System**: Gradle 8.7
- **HTTP Client**: Retrofit 2.6.2
- **UI**: Material Design Components
- **Navigation**: Android Navigation Components

## Package Structure

```
com.dreamfutureone.milkmanui/
├── ui/          # Activities & Fragments
│   ├── login/
│   ├── home/
│   ├── products/
│   ├── orders/
│   └── profile/
├── data/        # Models & API repositories
│   ├── model/
│   ├── api/
│   └── repository/
└── utils/       # Utilities & helpers
    ├── NetworkUtils
    ├── DateUtils
    └── Constants
```

## Setup

### 1. Configure SDK Path

Create `local.properties` from template:

```bash
cp local.properties.template local.properties
```

Edit `local.properties` with your Android SDK path:
```properties
sdk.dir=C:\\Users\\<YOUR_USERNAME>\\AppData\\Local\\Android\\Sdk
```

### 2. Sync Gradle

Open project in Android Studio and sync Gradle files.

### 3. Configure Backend URL

For **emulator** development, the backend URL is pre-configured to:
```
http://10.0.2.2:8081/milkman
```

For **physical device**, update the base URL in `data/api/ApiClient.java`:
```java
private static final String BASE_URL = "http://<YOUR_IP>:8081/milkman/";
```

## Building

### Debug Build
```bash
.\gradlew.bat assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Release Build
```bash
.\gradlew.bat assembleRelease
# Output: app/build/outputs/apk/release/app-release-unsigned.apk
```

### Clean Build
```bash
.\gradlew.bat clean build
```

### Install to Device
```bash
.\gradlew.bat installDebug
```

## Features

### Customer Features
- **Authentication**: Login & Registration
- **Product Catalog**: Browse milk products
- **Order Management**: Place and track orders
- **Subscriptions**: Manage recurring deliveries
- **Profile**: Update customer information

### Delivery Personnel Features (Future)
- Route optimization
- Delivery confirmation
- Real-time updates

## API Integration

The app communicates with the Spring Boot backend via Retrofit.

### Authentication
JWT tokens are stored in SharedPreferences and included in API headers:
```java
Authorization: Bearer <access_token>
```

## Testing

### Unit Tests
```bash
.\gradlew.bat test
```

### Instrumented Tests
```bash
.\gradlew.bat connectedAndroidTest
```

## See Also

- [Main Project README](../README.md)
- [Backend API Documentation](http://localhost:8081/milkman/swagger-ui.html)
- [Android Developer Guide](https://developer.android.com/docs)
