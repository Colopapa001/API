-- Insertar productos de prueba
-- Usando INSERT IGNORE para evitar duplicados si se ejecuta múltiples veces
INSERT IGNORE INTO products (name, description, price, stock, category_id, seller_id, image_url, created_at) VALUES
('iPhone 15', 'Último modelo de iPhone con cámara mejorada', 999.99, 10, 1, 9, NULL, NOW()),
('Samsung Galaxy S24', 'Smartphone Android de alta gama', 899.99, 15, 1, 9, NULL, NOW()),
('Camiseta Nike', 'Camiseta deportiva de algodón', 29.99, 50, 2, 9, NULL, NOW()),
('Pantalón Adidas', 'Pantalón deportivo cómodo', 49.99, 30, 2, 9, NULL, NOW()),
('Sofá 3 plazas', 'Sofá moderno para sala', 599.99, 5, 3, 9, NULL, NOW()),
('Mesa de centro', 'Mesa de centro de madera', 199.99, 8, 3, 9, NULL, NOW()),
('Balón de fútbol', 'Balón oficial de fútbol', 39.99, 25, 4, 9, NULL, NOW()),
('Raqueta de tenis', 'Raqueta profesional de tenis', 89.99, 12, 4, 9, NULL, NOW()),
('Libro de Java', 'Programación en Java para principiantes', 49.99, 20, 5, 9, NULL, NOW()),
('Novela de ficción', 'Novela de ciencia ficción', 19.99, 35, 5, 9, NULL, NOW());

