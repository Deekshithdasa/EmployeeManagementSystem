# Multi-stage build for Spring Boot backend
# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the Spring Boot application
FROM amazoncorretto:17

WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.loader.JarLauncher || exit 1

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
