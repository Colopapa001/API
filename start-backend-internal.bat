@echo off
cd /d %~dp0ecommerce-backend
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
