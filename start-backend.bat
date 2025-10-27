@echo off
echo ========================================
echo   Starting Ecommerce Backend
echo ========================================

REM Set Java environment - Java 17 installed
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Verify Java
echo Verificando Java...
java -version
if errorlevel 1 (
    echo ERROR: Java no encontrado en %JAVA_HOME%
    pause
    exit /b 1
)

echo.
echo Java configurado correctamente
echo.

REM Change to backend directory
cd ecommerce-backend

REM Start the application using local Maven
echo Iniciando aplicacion Spring Boot con Maven local...
echo Por favor espere, esto puede tardar unos minutos...
echo.

call apache-maven-3.9.9\bin\mvn.cmd spring-boot:run

pause
