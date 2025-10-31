-- Insertar categorías de prueba
-- Usar INSERT IGNORE para evitar errores si ya existen
INSERT IGNORE INTO categories (name, description) VALUES
('Electrónicos', 'Dispositivos electrónicos y tecnología'),
('Ropa', 'Vestimenta para hombres, mujeres y niños'),
('Hogar', 'Artículos para el hogar y decoración'),
('Deportes', 'Equipos y accesorios deportivos'),
('Libros', 'Libros y material educativo');

-- Insertar usuarios de prueba
-- Password: Password123 (meets requirements: capital letter + number)
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@ecommerce.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin', 'User', 'ADMIN'),
('seller1', 'seller1@ecommerce.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Juan', 'Pérez', 'SELLER'),
('user1', 'user1@ecommerce.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'María', 'García', 'USER');

-- Insertar productos de prueba
-- Usar INSERT IGNORE para evitar duplicados
INSERT IGNORE INTO products (name, description, price, stock, category_id, seller_id, image_url) VALUES
('iPhone 15', 'Último modelo de iPhone con cámara mejorada', 999.99, 10, 1, 2),
('Samsung Galaxy S24', 'Smartphone Android de alta gama', 899.99, 15, 1, 2),
('Camiseta Nike', 'Camiseta deportiva de algodón', 29.99, 50, 2, 2),
('Pantalón Adidas', 'Pantalón deportivo cómodo', 49.99, 30, 2, 2),
('Sofá 3 plazas', 'Sofá moderno para sala', 599.99, 5, 3, 2),
('Mesa de centro', 'Mesa de centro de madera', 199.99, 8, 3, 2),
('Balón de fútbol', 'Balón oficial de fútbol', 39.99, 25, 4, 2),
('Raqueta de tenis', 'Raqueta profesional de tenis', 89.99, 12, 4, 2),
('Libro de Java', 'Programación en Java para principiantes', 49.99, 20, 5, 2),
('Novela de ficción', 'Novela de ciencia ficción', 19.99, 35, 5, 2);