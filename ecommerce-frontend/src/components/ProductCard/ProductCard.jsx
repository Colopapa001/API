import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import './ProductCard.css';

const ProductCard = ({
  id,
  title,
  price,
  description,
  images = [],
  onAddToCart,
  loading = false
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const primaryImage = Array.isArray(images) && images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/400x400/CCCCCC/666666?text=Sin+imagen';

  return (
    <div className="product-card">
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
      
      <div className="product-content">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price.toFixed(2)}</p>
        <p className="product-description">{description}</p>
        
        <div className="product-actions">
          <Button
            variant="secondary"
            onClick={handleViewDetails}
            fullWidth
          >
            Ver Detalles
          </Button>
          
          <Button
            variant="primary"
            onClick={onAddToCart}
            loading={loading}
            fullWidth
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
