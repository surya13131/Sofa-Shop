# Use OpenJDK 21 for compatibility with your Java version
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file (assumes app is already built)
COPY target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
