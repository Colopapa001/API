-- Actualizar image_url en productos existentes
USE ecommerce_db;

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1740' WHERE name = 'iPhone 15';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1742' WHERE name = 'Samsung Galaxy S24';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1585032767761-878270336a0b?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Camiseta Nike';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621573094640-0b2391e9acec?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Pantalón Adidas';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Sofá 3 plazas';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1461418559055-6f020c5a91e7?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Mesa de centro';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1660926655155-8b1f8f9079f5?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Balón de fútbol';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1617883861744-13b534e3b928?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Raqueta de tenis';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1517770413964-df8ca61194a6?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Libro de Java';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1600' WHERE name = 'Novela de ficción';

-- Fin de script
