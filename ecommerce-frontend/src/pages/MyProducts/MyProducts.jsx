import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Input from '../../components/UI/Input';
import { getProductsByUser, deleteProduct, updateProduct } from '../../services/Api';
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    price: '',
    description: '',
    stock: ''
  });
  const [savingId, setSavingId] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Si no hay usuario en contexto, evitar llamar al backend con 'undefined'
      if (!user || !user.id) {
        setError('Sesión inválida o no iniciada. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      const userProducts = await getProductsByUser(user.id);
      // Filtrar productos eliminados en la sesión
      const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
      const filteredProducts = userProducts.filter(p => !deletedIds.includes(p.id));
      setProducts(filteredProducts);
      setError(null);
    } catch (err) {
      // Si es error de autorización, mostrar mensaje claro
      console.error('Error cargando productos:', err);
      const msg = err && err.message ? err.message : '';
      // Token inválido detectado por la capa de API
      if (msg === 'INVALID_TOKEN') {
        setError('Sesión inválida o token malformado. Por favor inicia sesión de nuevo.');
        return;
      }
      if (msg.includes('HTTP 401') || msg.includes('HTTP 403')) {
        setError('No tienes permisos para ver esta sección. Inicia sesión como SELLER o ADMIN.');
      } else {
        setError('Error cargando productos');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Scroll al inicio al montar
    import('../../utils/helpers').then(({ scrollToTop }) => scrollToTop('auto'));

    // Cargar productos solo si hay usuario
    if (user && user.id) {
      loadProducts();
    } else {
      // No hay usuario: dejar de mostrar loading e informar al usuario
      setLoading(false);
      setError('Sesión inválida o no iniciada. Por favor inicia sesión.');
    }

    // Cargar productos agregados en la sesión
    const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
    setSessionProducts(sessionCatalog);

    // Escuchar evento global de token inválido para mostrar mensaje y permitir re-login
    const onAuthInvalid = () => {
      setError('Sesión inválida o token malformado. Por favor inicia sesión de nuevo.');
      setLoading(false);
    };
    window.addEventListener('auth:invalid', onAuthInvalid);

    return () => {
      window.removeEventListener('auth:invalid', onAuthInvalid);
    };
  }, [loadProducts, user]);

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    setDeletingId(productId);
    
    try {
      // Intentar eliminar el producto usando la función importada
      await deleteProduct(productId);
      
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
    } catch (error) {
      console.error('Error eliminando producto:', error);
      // Mostrar mensaje de error al usuario
      setError('Error al eliminar el producto. Inténtalo nuevamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString()
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    console.log('handleSaveEdit invoked, editingProduct=', editingProduct);
    if (!editingProduct) return;

    const updatedProduct = {
      ...editingProduct,
      price: parseFloat(editForm.price) || 0,
      description: editForm.description,
      stock: parseInt(editForm.stock) || 0
    };

    setSavingId(editingProduct.id);

    try {
      console.log('local token:', localStorage.getItem('token'));
      // Si el producto está en sessionProducts (creado en sesión), actualizar solo localmente y en sessionStorage
      const isSessionProduct = sessionProducts.some(p => p.id === editingProduct.id);
      console.log('isSessionProduct=', isSessionProduct);
      if (isSessionProduct) {
        const newSession = sessionProducts.map(p => p.id === editingProduct.id ? updatedProduct : p);
        setSessionProducts(newSession);
        sessionStorage.setItem('myCatalog', JSON.stringify(newSession));

        // También actualizar la lista principal si existe ahí
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setError(null);
        return;
      }

      // Intentar persistir en backend
      console.log('Calling updateProduct for id', editingProduct.id);
      const res = await updateProduct(editingProduct.id, {
        // Backend validation expects a name (even if not editable in the modal),
        // so include the current name to avoid 400 validation errors.
        name: updatedProduct.name || updatedProduct.title || editingProduct.name || editingProduct.title,
        price: updatedProduct.price,
        description: updatedProduct.description,
        stock: updatedProduct.stock,
        // include categoryId if available to avoid nulling it accidentally
        categoryId: updatedProduct.categoryId || editingProduct.categoryId || null
      });
      console.log('updateProduct result=', res);

      if (res && res.success) {
        const serverProduct = res.product;
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? serverProduct : p));
        setError(null);
      } else {
        const msg = res && res.error ? res.error : 'Error guardando cambios en el servidor';
        setError(msg);
      }
    } catch (err) {
      console.error('Error guardando edición:', err);
      setError('Error guardando los cambios. Intenta de nuevo.');
    } finally {
      // Cerrar modal y limpiar estados de edición
      setEditingProduct(null);
      setEditForm({ price: '', description: '', stock: '' });
      setSavingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ price: '', description: '', stock: '' });
  };

  if (loading) {
    return (
      <div className="my-products-loading">
        <LoadingSpinner fullscreen={false} size="large" />
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
                  src={(Array.isArray(product.images) && product.images.length > 0) 
                    ? product.images[0] 
                    : product.image || '/images/placeholder.svg'}
                  alt={product.name || product.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.svg';
                  }}
                />
              </div>
              <div className="product-info">
                <div className="info-top">
                  <h3>{product.name || product.title}</h3>
                  <p className="product-description">{product.description || 'Sin descripción'}</p>
                </div>
                <p className="product-price">{formatPrice(product.price)}</p>
                <div className="product-status">
                  <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                  </span>
                </div>
                {product.createdAt && (
                  <p className="product-date">
                    Publicado: {formatDate(product.createdAt)}
                  </p>
                )}
              </div>
              <div className="product-actions">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(product)}
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

      {/* Modal de Edición */}
      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h2>Editar Producto</h2>
              <button 
                className="edit-modal-close"
                onClick={handleCancelEdit}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>
            
            <div className="edit-modal-content">
              <div className="edit-form-group">
                <label htmlFor="edit-title">Título</label>
                <Input
                  id="edit-title"
                  value={editingProduct.name || editingProduct.title}
                  disabled
                  placeholder="Título del producto"
                />
                <small>El título no se puede editar</small>
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-price">Precio ($)</label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) => handleEditFormChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-description">Descripción</label>
                <textarea
                  id="edit-description"
                  className="edit-textarea"
                  value={editForm.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  placeholder="Descripción del producto"
                  rows="4"
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-stock">Cantidad en Stock</label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(e) => handleEditFormChange('stock', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="edit-modal-actions">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                loading={savingId === editingProduct.id}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
