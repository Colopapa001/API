import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { getCategories } from '../../services/Api';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import './MyProducts.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edición
  const { user } = useAuth();
  const { addProduct, updateProduct, getProductById, error, clearError } = useProducts();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: '',
    imageFile: null
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'file'

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (id) {
      const product = getProductById(parseInt(id));
      if (product) {
        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          categoryId: product.categoryId?.toString() || '',
          image: product.image || '',
          imageFile: null
        });
        setImagePreview(product.image || '');
        setIsEditing(true);
      } else {
        navigate('/my-products');
      }
    }
  }, [id, getProductById, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update image preview for URL input
    if (name === 'image') {
      setImagePreview(value);
    }
    
    // Limpiar errores de validación
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setValidationErrors(prev => ({
          ...prev,
          imageFile: 'Por favor selecciona un archivo de imagen válido'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          imageFile: 'El archivo debe ser menor a 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear errors
      setValidationErrors(prev => ({
        ...prev,
        imageFile: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'El nombre del producto es requerido';
    }

    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser un número válido mayor a 0';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser un número válido mayor o igual a 0';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Debe seleccionar una categoría';
    }

    // Validate image based on input type
    if (imageInputType === 'url') {
      if (!formData.image.trim()) {
        errors.image = 'La URL de la imagen es requerida';
      } else {
        // Validar que sea una URL válida
        try {
          new URL(formData.image);
        } catch {
          errors.image = 'Debe ser una URL válida';
        }
      }
    } else {
      if (!formData.imageFile && !isEditing) {
        errors.imageFile = 'Por favor selecciona una imagen';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      let imageUrl = formData.image;

      // If using file upload, convert to base64 data URL
      if (imageInputType === 'file' && formData.imageFile) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(formData.imageFile);
        });
      }

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        image: imageUrl
      };

      let success;
      if (isEditing) {
        success = updateProduct(parseInt(id), productData);
      } else {
        success = addProduct(productData);
      }

      if (success) {
        navigate('/my-products');
      }
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-products');
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h1>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <Input
              type="text"
              name="title"
              label="Nombre del Producto"
              value={formData.title}
              onChange={handleChange}
              error={validationErrors.title}
              placeholder="Ingresa el nombre del producto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu producto..."
              rows="4"
              className={validationErrors.description ? 'error' : ''}
              required
            />
            {validationErrors.description && (
              <span className="error-text">{validationErrors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Categoría *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`form-select ${validationErrors.categoryId ? 'error' : ''}`}
              required
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? 'Cargando categorías...' : 'Selecciona una categoría'}
              </option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {validationErrors.categoryId && (
              <span className="error-text">{validationErrors.categoryId}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <Input
                type="number"
                name="price"
                label="Precio ($)"
                value={formData.price}
                onChange={handleChange}
                error={validationErrors.price}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <Input
                type="number"
                name="stock"
                label="Stock"
                value={formData.stock}
                onChange={handleChange}
                error={validationErrors.stock}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Imagen del Producto</label>
            <div className="image-input-options">
              <div className="input-type-selector">
                <label>
                  <input
                    type="radio"
                    name="imageInputType"
                    value="url"
                    checked={imageInputType === 'url'}
                    onChange={(e) => setImageInputType(e.target.value)}
                  />
                  URL de imagen
                </label>
                <label>
                  <input
                    type="radio"
                    name="imageInputType"
                    value="file"
                    checked={imageInputType === 'file'}
                    onChange={(e) => setImageInputType(e.target.value)}
                  />
                  Subir archivo
                </label>
              </div>

              {imageInputType === 'url' ? (
                <Input
                  type="url"
                  name="image"
                  label=""
                  value={formData.image}
                  onChange={handleChange}
                  error={validationErrors.image}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              ) : (
                <div className="file-input-container">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="imageFile" className="file-input-label">
                    {formData.imageFile ? formData.imageFile.name : 'Seleccionar imagen...'}
                  </label>
                  {validationErrors.imageFile && (
                    <span className="error-text">{validationErrors.imageFile}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {imagePreview && (
            <div className="image-preview">
              <label>Vista previa:</label>
              <img 
                src={imagePreview} 
                alt="Vista previa del producto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                onLoad={(e) => {
                  e.target.style.display = 'block';
                }}
              />
            </div>
          )}

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;