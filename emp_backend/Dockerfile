
FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app


COPY pom.xml .
COPY src ./src


RUN mvn clean package -DskipTests


FROM amazoncorretto:17

WORKDIR /app


COPY --from=builder /app/target/*.jar app.jar


EXPOSE 8080


HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.loader.JarLauncher || exit 1


ENTRYPOINT ["java", "-jar", "app.jar"]
