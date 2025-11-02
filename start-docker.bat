@echo off
echo ========================================
echo    E-commerce Docker Starter
echo ========================================
echo.

REM Verificar Docker
where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta instalado
    echo Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker encontrado
echo.

REM Verificar que Docker Desktop este corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop no esta corriendo
    echo Por favor inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)

echo [OK] Docker Desktop esta corriendo
echo.

REM Verificar que docker-compose existe
where docker-compose >nul 2>&1
if errorlevel 1 (
    echo [INFO] docker-compose no encontrado, usando 'docker compose' integrado
    set DOCKER_COMPOSE_CMD=docker compose
) else (
    set DOCKER_COMPOSE_CMD=docker-compose
)

echo [OK] Docker Compose disponible
echo.

REM Verificar si los contenedores ya estan corriendo
%DOCKER_COMPOSE_CMD% ps 2>&1 | findstr "ecommerce" >nul
if errorlevel 1 goto start_containers

echo.
echo [!] Los contenedores ya estan corriendo
echo.
echo Opciones:
echo 1 - Ver logs
echo 2 - Reiniciar contenedores
echo 3 - Detener contenedores
echo 4 - Salir
echo.
set /p option="Selecciona una opcion (1-4): "

if "%option%"=="1" (
    echo.
    echo Mostrando logs (Ctrl+C para salir)...
    %DOCKER_COMPOSE_CMD% logs -f
    exit /b 0
)

if "%option%"=="2" (
    echo.
    echo Reiniciando contenedores...
    %DOCKER_COMPOSE_CMD% restart
    echo [OK] Contenedores reiniciados
    echo.
    pause
    exit /b 0
)

if "%option%"=="3" (
    echo.
    echo Deteniendo contenedores...
    %DOCKER_COMPOSE_CMD% stop
    echo [OK] Contenedores detenidos
    echo.
    pause
    exit /b 0
)

if "%option%"=="4" exit /b 0

exit /b 0

:start_containers
echo.
echo Iniciando aplicacion E-commerce...
echo.
echo [INFO] Esto puede tardar varios minutos la primera vez
echo [INFO] Espere a ver 'healthy' para cada servicio
echo.

REM Construir e iniciar contenedores
%DOCKER_COMPOSE_CMD% up -d --build

if errorlevel 1 (
    echo.
    echo [ERROR] Error al iniciar contenedores
    echo.
    echo Intentando sin --build...
    %DOCKER_COMPOSE_CMD% up -d
    if errorlevel 1 (
        echo.
        echo [ERROR] No se pudo iniciar los contenedores
        echo Verifica los logs con: %DOCKER_COMPOSE_CMD% logs
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo    Servicios iniciados
echo ========================================
echo.
echo Esperando 30 segundos para que inicien completamente...
timeout /t 30 /nobreak >nul
echo.

REM Ver estado
echo Estado de los contenedores:
%DOCKER_COMPOSE_CMD% ps
echo.

REM Ver logs recientes
echo Logs recientes (ultimas 20 lineas):
%DOCKER_COMPOSE_CMD% logs --tail=20
echo.
echo ========================================
echo    Tu aplicacion esta lista!
echo ========================================
echo.
echo Frontend:    http://localhost:3000
echo Backend:     http://localhost:8080/api
echo Base datos:  localhost:3306
echo.
echo Usuarios de prueba:
echo - admin@ecommerce.com / Password123 (ADMIN)
echo - seller1@ecommerce.com / Password123 (SELLER)
echo - user1@ecommerce.com / Password123 (USER)
echo.
echo Comandos utiles:
echo - Ver logs:        %DOCKER_COMPOSE_CMD% logs -f
echo - Detener:         %DOCKER_COMPOSE_CMD% stop
echo - Eliminar todo:   %DOCKER_COMPOSE_CMD% down -v
echo.
echo Presiona cualquier tecla para abrir el navegador o Ctrl+C para salir...
pause >nul

REM Abrir navegador
start http://localhost:3000

echo.
echo Navegador abierto. Los logs continuan corriendo.
echo Presiona Ctrl+C para ver solo logs o cierra esta ventana.
echo.

REM Seguir mostrando logs
%DOCKER_COMPOSE_CMD% logs -f
