# ==============================================================================
# Multi-stage Dockerfile for HanginOut Spring Boot Backend
# - Java: 17
# - Spring Boot: 3.3.4
# - Target Deployment: Render (Root Directory: Backend) & Local Docker
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build the application using Maven & Temurin JDK 17
# ------------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy Maven POM descriptor first to cache dependencies in a Docker layer
COPY pom.xml .

# Download dependencies (cached unless pom.xml changes)
RUN mvn dependency:resolve -B

# Copy application source tree
COPY src ./src

# Package the executable JAR, skipping unit/integration tests during image build
RUN mvn clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Minimal production runtime using Temurin JRE 17 Alpine
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-privileged system group and user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Default fallback port if PORT is not set by the host platform (e.g., Render)
# Production profile active by default in container
# JVM flags optimized for container environments (respects cgroup memory limits)
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Expose fallback application port
EXPOSE 8080

# Copy the generated Spring Boot executable JAR from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Set file ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Launch the application
# - 'exec' replaces shell PID 1 so POSIX signals (SIGTERM/SIGINT) reach JVM for graceful shutdown
# - '-Dserver.port=${PORT}' guarantees the app listens on Render's dynamic PORT (fallback: 8080)
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
