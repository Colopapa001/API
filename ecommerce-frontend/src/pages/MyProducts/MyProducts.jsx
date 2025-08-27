import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getProductsByUser, deleteProduct } from '../../../utils/mockData';
import { formatPrice, formatDate } from '../../../utils/helpers';
import './MyProducts.css';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [user.id]);

  const loadProducts = async () => {
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
  };

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
    <div className="my-products">
      <div className="my-products-header">
        <h1>Mis Productos</h1>
        <Button onClick={() => navigate('/my-products/add')}>
          Agregar Producto
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="my-products-empty">
          <h3>No tienes productos publicados</h3>
          <p>¡Comienza a vender agregando tu primer producto!</p>
          <Button onClick={() => navigate('/my-products/add')}>
            Agregar Producto
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
                <div className="product-status">
                  <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                  </span>
                </div>
              </div>

              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                <p className="product-date">
                  Publicado: {formatDate(product.createdAt)}
                </p>
              </div>

              <div className="product-actions">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(product.id)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                  loading={deletingId === product.id}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
