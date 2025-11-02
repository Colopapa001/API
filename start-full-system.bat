@echo off
echo ========================================
echo   Ecommerce Full System Starter
echo ========================================

REM Do not hardcode JAVA_HOME here. start-backend.bat will detect/derive JAVA_HOME safely.
REM Just verify there's some java on PATH; if not, warn and exit.
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: java no encontrado en PATH. Por favor instala JDK 17 o añade java al PATH.
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

REM Stop any existing backend process that is listening on 8080 (avoid killing all java processes)
echo.
echo Deteniendo proceso que ocupa el puerto 8080 (si existe)...
set "_PID="
rem Filtrar solo las líneas que están en estado LISTENING para evitar capturar columnas equivocadas
for /f "delims=" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr /I "LISTENING"') do (
    for /f "tokens=5" %%b in ("%%a") do (
        set "_PID=%%b"
        goto :_kill_pid
    )
)
if not defined _PID (
    echo No se detectó proceso en el puerto 8080.
    goto :_after_kill
)

:_kill_pid
echo Matando PID %_PID% que ocupa 8080...
taskkill /F /PID %_PID% >nul 2>&1
if %errorlevel% equ 0 (
    echo PID %_PID% terminado.
) else (
    echo No se pudo terminar PID %_PID% (permiso o ya finalizado).
)
timeout /t 2 /nobreak >nul

:_after_kill

echo.
echo ========================================
echo Iniciando Backend...
echo ========================================
echo Por favor espere, esto puede tardar unos minutos...
echo.

REM Start backend in a new window using a small wrapper that forces JDK17 if present
REM This avoids nested quoting issues and keeps start-backend.bat unchanged.
start "Ecommerce Backend" "%~dp0start-backend-with-jdk.bat"

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
