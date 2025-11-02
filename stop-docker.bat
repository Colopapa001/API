@echo off
echo ========================================
echo    E-commerce Docker Stopper
echo ========================================
echo.

REM Verificar Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no esta instalado
    pause
    exit /b 1
)

REM Verificar que docker-compose existe
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    set DOCKER_COMPOSE_CMD=docker compose
) else (
    set DOCKER_COMPOSE_CMD=docker-compose
)

echo.
echo [1] Detener contenedores (mantiene datos)
echo [2] Detener y eliminar contenedores (mantiene volumenes)
echo [3] Detener y eliminar TODO (PERDIDA DE DATOS)
echo [4] Cancelar
echo.
set /p option="Selecciona una opcion (1-4): "

if "%option%"=="1" (
    echo.
    echo Deteniendo contenedores...
    %DOCKER_COMPOSE_CMD% stop
    echo [OK] Contenedores detenidos
    echo Los datos se mantienen
)

if "%option%"=="2" (
    echo.
    echo Deteniendo y eliminando contenedores...
    %DOCKER_COMPOSE_CMD% down
    echo [OK] Contenedores eliminados
    echo Los volúmenes de BD se mantienen
)

if "%option%"=="3" (
    echo.
    echo [!] ADVERTENCIA: Esto eliminara TODOS los datos
    set /p confirm="¿Estas seguro? (Escribe 'SI' para confirmar): "
    if /i "%confirm%"=="SI" (
        echo Eliminando todo...
        %DOCKER_COMPOSE_CMD% down -v
        echo [OK] Todo eliminado
    ) else (
        echo Operacion cancelada
    )
)

if "%option%"=="4" (
    echo Cancelado
    exit /b 0
)

echo.
pause

