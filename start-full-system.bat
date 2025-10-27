@echo off
echo ========================================
echo   Ecommerce Full System Starter
echo ========================================

REM Set Java environment - Java 17 installed
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Verify Java is installed
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java no encontrado. Por favor instala Java 17.
    pause
    exit /b 1
)

REM Verify Node.js is installed (check in common installation paths)
set "NODE_FOUND=0"
where node >nul 2>&1
if %errorlevel% equ 0 set "NODE_FOUND=1"

REM If not in PATH, check common installation locations and add to PATH
if "%NODE_FOUND%"=="0" (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_FOUND=1"
        set "PATH=C:\Program Files\nodejs;%PATH%"
    )
    if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "NODE_FOUND=1"
        set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
    )
)

if "%NODE_FOUND%"=="0" (
    echo ERROR: Node.js no encontrado. Por favor instala Node.js.
    pause
    exit /b 1
)

REM Stop any existing backend processes
echo.
echo Deteniendo procesos existentes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Iniciando Backend...
echo ========================================
echo Por favor espere, esto puede tardar unos minutos...
echo.

REM Start backend in a new window using internal script
start "Ecommerce Backend" cmd /k "%~dp0start-backend-internal.bat"

REM Wait for backend to start (increased to 60 seconds)
echo.
echo Esperando 60 segundos para que el backend inicie completamente...
for /l %%i in (60,-1,1) do (
    timeout /t 1 /nobreak >nul
    echo Iniciando... %%i segundos restantes
)
echo.

REM Verify backend is running
echo Verificando que el backend esté funcionando...
curl -s http://localhost:8080/api/categories >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: El backend puede no estar completamente iniciado.
    echo Esperando 30 segundos adicionales...
    timeout /t 30 /nobreak >nul
)

echo.
echo ========================================
echo Iniciando Frontend...
echo ========================================
echo.

REM Start frontend in a new window
start "Ecommerce Frontend" cmd /k "cd /d %~dp0ecommerce-frontend && npm start"

echo.
echo ========================================
echo Sistema iniciado!
echo ========================================
echo.
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.
echo Credenciales de prueba:
echo - Usuario: frontenduser
echo - Contraseña: Password123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
