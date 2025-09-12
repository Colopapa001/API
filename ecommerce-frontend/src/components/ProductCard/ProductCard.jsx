import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import './ProductCard.css';

const ProductCard = ({
  id,
  title,
  price,
  description,
  image,
  stockLabel,
  formattedPrice,
  images = [],
  onAddToCart,
  stock
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Simula la llegada de datos del producto
    if (id && title && price) {
      setLoading(false);
    }
    // Si quisieras simular un error, podrías usar setError('Hubo un error al cargar el producto');
  }, [id, title, price]);

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const primaryImage = Array.isArray(images) && images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/400x400/CCCCCC/666666?text=Sin+imagen';

  return (
    <div className="product-card">
      {loading ? (
        <div>Cargando productos...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div className="product-content">
            <div className="product-image-container">
              <img 
                src={primaryImage} 
                alt={title} 
                className="product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=Sin+imagen';
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">{title}</h3>
              <p className="product-description">{description}</p>
              <p className="product-price">{formattedPrice || `$${price.toFixed(2)}`}</p>
              {stock !== undefined && (
                <p className="product-stock">Stock: {stock}</p>
              )}
            </div>
          </div>
          <div className="product-actions">
            <Button
              variant="secondary"
              onClick={handleViewDetails}
              fullWidth
              className="btn-full-width"
            >
              Ver Detalles
            </Button>
            <Button
              variant="primary"
              onClick={onAddToCart}
              fullWidth
              className="btn-full-width"
            >
              Agregar al Carrito
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
