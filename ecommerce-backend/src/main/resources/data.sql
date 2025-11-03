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
-- Usar subconsulta para obtener el ID del seller1 dinámicamente
INSERT IGNORE INTO products (name, description, price, stock, category_id, seller_id, image_url, created_at) VALUES
('iPhone 15', 'Último modelo de iPhone con cámara mejorada', 999.99, 10, (SELECT id FROM categories WHERE name = 'Electrónicos' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740', NOW()),
('Samsung Galaxy S24', 'Smartphone Android de alta gama', 899.99, 15, (SELECT id FROM categories WHERE name = 'Electrónicos' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742', NOW()),
('Camiseta Nike', 'Camiseta deportiva de algodón', 29.99, 50, (SELECT id FROM categories WHERE name = 'Ropa' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1585032767761-878270336a0b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVtZXJhJTIwbmlrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1600', NOW()),
('Pantalón Adidas', 'Pantalón deportivo cómodo', 49.99, 30, (SELECT id FROM categories WHERE name = 'Ropa' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1621573094640-0b2391e9acec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhbnRhbG9uJTIwYWRpZGFzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600', NOW()),
('Sofá 3 plazas', 'Sofá moderno para sala', 599.99, 5, (SELECT id FROM categories WHERE name = 'Hogar' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c29mYTMlMjBwbGF6YXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600', NOW()),
('Mesa de centro', 'Mesa de centro de madera', 199.99, 8, (SELECT id FROM categories WHERE name = 'Hogar' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1461418559055-6f020c5a91e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVzYSUyMGRlJTIwY2VudHJvfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600', NOW()),
('Balón de fútbol', 'Balón oficial de fútbol', 39.99, 25, (SELECT id FROM categories WHERE name = 'Deportes' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1660926655155-8b1f8f9079f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFsb24lMjBmdXRib2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600', NOW()),
('Raqueta de tenis', 'Raqueta profesional de tenis', 89.99, 12, (SELECT id FROM categories WHERE name = 'Deportes' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1617883861744-13b534e3b928?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFxdWV0YSUyMGRlJTIwdGVuaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600', NOW()),
('Libro de Java', 'Programación en Java para principiantes', 49.99, 20, (SELECT id FROM categories WHERE name = 'Libros' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1517770413964-df8ca61194a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxpYnJvfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600', NOW()),
('Novela de ficción', 'Novela de ciencia ficción', 19.99, 35, (SELECT id FROM categories WHERE name = 'Libros' LIMIT 1), (SELECT id FROM users WHERE username = 'seller1' LIMIT 1), 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxpYnJvfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600', NOW());