import React from 'react';
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
  onAddToCart,
  loading = false
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image} 
          alt={title} 
          className="product-image"
          onError={(e) => {
            e.target.src = '/images/placeholder.png';
          }}
        />
      </div>
      
      <div className="product-content">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">{formattedPrice || `$${price.toFixed(2)}`}</p>
        <p className="product-description">{description}</p>
        
        <div className="product-stock">
          <span className={`stock-badge ${!stockLabel || stockLabel === 'Sin stock' ? 'out-of-stock' : 'in-stock'}`}>
            {stockLabel || 'Stock no disponible'}
          </span>
        </div>
        
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
