import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import './ProductCard.css';

const ProductCard = ({
  id,
  name,
  price,
  description,
  image_url,
  images,
  stockLabel,
  formattedPrice,
  onAddToCart,
  loading = false,
  stock
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card">
      <div className="product-content">
        <div className="product-image-container">
          {
            (() => {
              const placeholder = '/images/placeholder.svg';
              // Prefer explicit image_url, otherwise try images array (ignore blob: URLs)
              let src = image_url;
              if (!src || src === 'null') {
                if (Array.isArray(images) && images.length > 0) {
                  const valid = images.find(i => typeof i === 'string' && i && !i.startsWith('blob:'));
                  src = valid || null;
                }
              }
              if (!src) src = placeholder;

              return (
                <img
                  src={src}
                  alt={name}
                  className="product-image"
                  onError={(e) => {
                    // prevent infinite error loop
                    try { e.target.onerror = null; } catch {}
                    e.target.src = placeholder;
                  }}
                />
              );
            })()
          }
        </div>
        <div className="product-info">
          <h3 className="product-title">{name}</h3>
          <div className="product-meta-row">
            <span className="product-price">{formattedPrice || `$${price.toFixed(2)}`}</span>
            {stock !== undefined && (
              <span className={`stock-badge ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {stock > 0 ? 'En stock' : 'Sin stock'}
              </span>
            )}
          </div>
          <p className="product-description">{description}</p>
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