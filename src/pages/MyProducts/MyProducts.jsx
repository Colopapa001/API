import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getProductsByUser, deleteProduct } from '../../utils/mockData';
import { formatPrice } from '../../utils/helpers';
import './MyProducts.css';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const userProducts = await getProductsByUser(user.id);
      setProducts(userProducts);
      setError(null);
    } catch (err) {
      setError('Error cargando productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      setDeletingId(productId);
      const result = await deleteProduct(productId, user.id);
      
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Error eliminando producto');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/my-products/edit/${productId}`);
  };

  if (loading) {
    return (
      <div className="my-products-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-products-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={loadProducts}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="my-products-container">
      <div className="my-products-header">
        <h1>Mis Productos</h1>
        <Button 
          variant="primary"
          onClick={() => navigate('/my-products/add')}
        >
          Agregar Producto
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="my-products-empty">
          <h3>No tienes productos publicados</h3>
          <p>¡Comienza a vender agregando tu primer producto!</p>
          <Button 
            variant="primary"
            onClick={() => navigate('/my-products/add')}
          >
            Agregar Producto
          </Button>
        </div>
      ) : (
        <div className="my-products-grid">
          {products.map(product => (
            <article key={product.id} className="my-product-card">
              <div className="my-product-image-container">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Producto';
                  }}
                />
              </div>
              
              <div className="my-product-details">
                <h3>{product.title}</h3>
                <p className="my-product-description">{product.description}</p>
                
                <div className="my-product-stats">
                  <div className="my-product-price">
                    {formatPrice(product.price)}
                  </div>
                  <div className="my-product-stock">
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                  </div>
                </div>

                <div className="my-product-actions">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(product.id)}
                    className="edit-button"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                    loading={deletingId === product.id}
                    className="delete-button"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
