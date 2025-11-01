@echo off
echo ========================================
echo   Starting Ecommerce Backend
echo ========================================

REM Configure JAVA_HOME: prefer existing env var; fall back to java.exe discovery
if defined JAVA_HOME (
    echo Using existing JAVA_HOME: %JAVA_HOME%
    if not exist "%JAVA_HOME%\bin\java.exe" (
        echo WARNING: %JAVA_HOME%\bin\java.exe not found. Will try to derive JAVA_HOME from PATH.
        set "JAVA_HOME="
    )
)

if not defined JAVA_HOME (
    REM 1) Try where javac
    for /f "delims=" %%J in ('where javac 2^>nul') do (
        set "_JAVA_EXE=%%~fJ"
        goto :_found_java_exe
    )

    REM 2) Try where java and check parent for javac
    for /f "delims=" %%A in ('where java 2^>nul') do (
        set "_TMP_JAVA_EXE=%%~fA"
        for %%B in ("%%~fA") do set "_TMP_DIR=%%~dpB"
        pushd "%_TMP_DIR%.." >nul 2>&1
        if exist "%CD%\bin\javac.exe" (
            set "JAVA_HOME=%CD%"
            popd >nul 2>&1
            goto :_java_ready
        )
        popd >nul 2>&1
    )

    REM 3) Check common installation locations
    for %%K in (
        "C:\Program Files\Java\jdk-17",
        "C:\Program Files\Java\jdk-17.0.12",
        "C:\Program Files\Java\jdk-17*",
        "C:\Program Files\Eclipse Adoptium\jdk-*",
        "C:\Program Files\AdoptOpenJDK\jdk-*",
        "C:\Program Files\Temurin*"
    ) do (
        if exist %%~K\bin\javac.exe (
            set "JAVA_HOME=%%~K"
            goto :_java_ready
        )
    )

    REM 4) Try registry for JDK JavaHome
    for /f "tokens=2*" %%R in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK" /v CurrentVersion 2^>nul ^| find "CurrentVersion"') do set "JDK_CUR=%%S"
    if defined JDK_CUR (
        for /f "tokens=2*" %%R in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\%JDK_CUR%" /v JavaHome 2^>nul ^| find "JavaHome"') do set "JAVA_REG=%%S"
        if defined JAVA_REG if exist "%%JAVA_REG%%\bin\javac.exe" (
            set "JAVA_HOME=%%JAVA_REG%%"
            goto :_java_ready
        )
    )

    echo ERROR: java/javac not found on PATH and JAVA_HOME not set. Install JDK 17 and set JAVA_HOME.
    pause
    exit /b 1
)
goto :_java_ready

:_found_java_exe
rem derive JAVA_HOME from java.exe path (assumes ...\bin\java.exe)
for %%D in ("%_JAVA_EXE%") do set "_JAVA_DIR=%%~dpD"
pushd "%_JAVA_DIR%.." >nul 2>&1 && set "JAVA_HOME=%CD%" & popd >nul 2>&1
set "_JAVA_EXE="

:_java_ready
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
