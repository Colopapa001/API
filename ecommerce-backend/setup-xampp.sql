-- Script para configurar la base de datos en XAMPP
-- Ejecutar este script en phpMyAdmin o MySQL Workbench

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE ecommerce_db;

-- Verificar que la base de datos se creó correctamente
SHOW DATABASES;

-- Mostrar información de la base de datos
SELECT DATABASE();
