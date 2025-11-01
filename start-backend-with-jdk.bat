@echo off
REM Helper to start backend with a forced JDK 17 in the new window.
REM This file is a lightweight wrapper that sets JAVA_HOME and then calls start-backend.bat

set "FORCED_JAVA=C:\Program Files\Java\jdk-17"

if exist "%FORCED_JAVA%\bin\java.exe" (
    set "JAVA_HOME=%FORCED_JAVA%"
    set "PATH=%JAVA_HOME%\bin;%PATH%"
    echo Forzando JAVA_HOME a %JAVA_HOME%
) else (
    echo Ruta forzada %FORCED_JAVA% no encontrada, se usará la deteccion interna en start-backend.bat
)

call "%~dp0start-backend.bat"

pause
