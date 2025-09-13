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
  images = [],
  onAddToCart,
  loading = false,
  stock
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const primaryImage = (() => {
    // Handle both single image (in-memory products) and image arrays (API products)
    if (image) {
      return image;
    } else if (Array.isArray(images) && images.length > 0) {
      return images[0];
    } else {
      return 'https://via.placeholder.com/400x400/CCCCCC/666666?text=Sin+imagen';
    }
  })();

  return (
    <div className="product-card">
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
          loading={loading}
          fullWidth
          className="btn-full-width"
        >
          Agregar al Carrito
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
