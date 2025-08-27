import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { createProduct, getCategories } from '../../../utils/mockData';
import { validateProductData, imageUtils } from '../../../utils/helpers';
import './MyProducts.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Cargar categorías
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await getCategories();
        setCategories(categoriesList);
      } catch (err) {
        setError('Error cargando categorías');
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validar archivos
    for (const file of files) {
      const validation = imageUtils.isValidImageFile(file);
      if (!validation.isValid) {
        setError(Object.values(validation.errors)[0]);
        return;
      }
    }

    // Procesar imágenes
    try {
      const processedImages = await Promise.all(
        files.map(async file => {
          // Redimensionar imagen
          const resizedBlob = await imageUtils.resizeImage(file);
          return URL.createObjectURL(resizedBlob);
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...processedImages]
      }));
    } catch (err) {
      setError('Error procesando imágenes');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos
    const validation = validateProductData(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId)
      };

      const result = await createProduct(productData, user.id);
      
      if (result.success) {
        navigate('/my-products');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Error creando producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-header">
        <h1>Agregar Nuevo Producto</h1>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <Input
            label="Título del producto"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={validationErrors.title}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <Input
            type="textarea"
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={validationErrors.description}
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <Input
              type="number"
              label="Precio"
              name="price"
              value={formData.price}
              onChange={handleChange}
              error={validationErrors.price}
              min="0"
              step="0.01"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <Input
              type="number"
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              error={validationErrors.stock}
              min="0"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Categoría</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {validationErrors.categoryId && (
            <div className="error-message">{validationErrors.categoryId}</div>
          )}
        </div>

        <div className="form-group">
          <label>Imágenes</label>
          <div className="image-upload-container">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={loading}
            />
            <div className="image-preview-grid">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {validationErrors.images && (
            <div className="error-message">{validationErrors.images}</div>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/my-products')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Crear Producto
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
