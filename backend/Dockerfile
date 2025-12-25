# Stage 1: Build the application
FROM gradle:8.5-jdk17-alpine AS build

# Set working directory
WORKDIR /app

# Copy Gradle files first for caching
COPY build.gradle gradlew ./
COPY gradle ./gradle

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN ./gradlew build -x test --no-daemon

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built JAR from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose application port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/milkman/healthCheck || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
