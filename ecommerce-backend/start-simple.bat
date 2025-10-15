@echo off
echo Starting Ecommerce Backend (Simple Method)...
echo.

REM Set JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-24
echo JAVA_HOME set to: %JAVA_HOME%

REM Navigate to backend directory
cd /d "%~dp0"

echo Current directory: %CD%

REM Check if Java is available
java -version
if %errorlevel% neq 0 (
    echo Java is not available in PATH
    echo Trying to use JAVA_HOME directly...
    "%JAVA_HOME%\bin\java" -version
    if %errorlevel% neq 0 (
        echo Java is not working. Please check your Java installation.
        pause
        exit /b 1
    )
)

echo.
echo Starting Spring Boot application...
echo This may take a few minutes on first run...

REM Try to run the JAR file directly if it exists
if exist "target\ecommerce-backend-0.0.1-SNAPSHOT.jar" (
    echo Found JAR file, running directly...
    "%JAVA_HOME%\bin\java" -jar target\ecommerce-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=h2
) else (
    echo JAR file not found, trying Maven...
    .\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run "-Dspring.profiles.active=h2"
)

pause
