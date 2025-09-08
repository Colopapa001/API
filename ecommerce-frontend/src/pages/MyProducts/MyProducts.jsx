import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getProductsByUser, deleteProduct } from '../../utils/mockData';
import { formatPrice, formatDate } from '../../utils/helpers';
import './MyProducts.css';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [sessionProducts, setSessionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const userProducts = await getProductsByUser(user.id);
      // Filtrar productos eliminados en la sesión
      const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
      const filteredProducts = userProducts.filter(p => !deletedIds.includes(p.id));
      setProducts(filteredProducts);
      setError(null);
    } catch (err) {
      setError('Error cargando productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    // Scroll al inicio al montar
    import('../../utils/helpers').then(({ scrollToTop }) => scrollToTop('auto'));
  loadProducts();
  // Cargar productos agregados en la sesión
  const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
  setSessionProducts(sessionCatalog);
  }, [loadProducts]);

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    setDeletingId(productId);
    // Si el producto fue agregado en la sesión, eliminar de sessionStorage
    const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
    const newCatalog = sessionCatalog.filter(p => p.id !== productId);
    sessionStorage.setItem('myCatalog', JSON.stringify(newCatalog));
    setSessionProducts(newCatalog);
    // Si el producto es propio, guardar su ID en sessionStorage para excluirlo en la sesión
    if (products.some(p => p.id === productId && p.userId === user.id)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
      sessionStorage.setItem('deletedMyProducts', JSON.stringify([...deletedIds, productId]));
    }
    setDeletingId(null);
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

      {products.length === 0 && sessionProducts.length === 0 ? (
        <div className="my-products-empty">
          <h3>No tienes productos publicados</h3>
          <p>¡Comienza a vender agregando tu primer producto!</p>
          <Button onClick={() => navigate('/my-products/add')}>
            Agregar Producto
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {[...products,
            ...sessionProducts.filter(
              sp => !products.some(p => p.id === sp.id)
            )
          ].map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
              </div>
              <div className="product-info">
                <div className="info-top">
                  <h3>{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
                <p className="product-price">{formatPrice(product.price)}</p>
                <div className="product-status">
                  <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                  </span>
                </div>
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
