@echo off
echo ========================================
echo Starting Ecommerce Backend (internal)
echo ========================================

cd /d %~dp0ecommerce-backend

REM Prefer existing JAVA_HOME if valid
if defined JAVA_HOME (
	if exist "%JAVA_HOME%\bin\java.exe" (
		echo Using existing JAVA_HOME: %JAVA_HOME%
	) else (
		echo WARNING: %JAVA_HOME%\bin\java.exe not found. Unsetting JAVA_HOME and will try to derive from PATH.
		set "JAVA_HOME="
	)
)

REM If no JAVA_HOME, try to derive it from where java
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

	echo ERROR: java/javac not found on PATH and JAVA_HOME not set. Please install JDK 17 and set JAVA_HOME.
	pause
	exit /b 1
)
goto :_java_ready

:_found_java_exe
for %%D in ("%_JAVA_EXE%") do set "_JAVA_DIR=%%~dpD"
pushd "%_JAVA_DIR%.." >nul 2>&1 && set "JAVA_HOME=%CD%" & popd >nul 2>&1
set "_JAVA_EXE="

:_java_ready
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Verificando java...
java -version
if errorlevel 1 (
	echo ERROR: Java not found or not usable in %JAVA_HOME%
	pause
	exit /b 1
)

echo Java listo en %JAVA_HOME%

REM Start Spring Boot
echo Iniciando Spring Boot (maven)...
apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
