@echo off
echo Configurando base de datos para XAMPP...
echo.

echo 1. Verificando que XAMPP este ejecutandose...
netstat -an | findstr :3306
if %errorlevel% neq 0 (
    echo ERROR: MySQL no esta ejecutandose. Por favor inicia XAMPP.
    pause
    exit /b 1
)

echo 2. MySQL esta ejecutandose correctamente.
echo.

echo 3. Para configurar la base de datos manualmente:
echo    - Abre http://localhost/dashboard en tu navegador
echo    - Ve a la seccion "Tools" y haz clic en "phpMyAdmin"
echo    - O intenta estas URLs alternativas:
echo      * http://localhost/phpmyadmin
echo      * http://127.0.0.1/phpmyadmin
echo      * http://localhost/xampp/phpmyadmin
echo.

echo 4. Una vez en phpMyAdmin:
echo    - Crea una nueva base de datos llamada "ecommerce_db"
echo    - O ejecuta el script setup-xampp.sql
echo.

echo 5. Si phpMyAdmin no funciona, la aplicacion creara la base de datos automaticamente.
echo.

pause
