import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { createProduct, getCategories } from '../../utils/mockData';
import { validateProductData, isValidImageFile } from '../../utils/helpers';
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
    images: [],
    condition: 'new', // nuevo o usado
    brand: '',
    model: '',
    features: [],
    dimensions: {
      width: '',
      height: '',
      depth: '',
      weight: ''
    }
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
    
    // Manejar campos anidados (dimensiones)
    if (name.includes('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
      const validation = isValidImageFile(file);
      if (!validation.isValid) {
        setError(Object.values(validation.errors).filter(err => err).join(', '));
        return;
      }
    }

    // Procesar imágenes
    try {
      const processedImages = await Promise.all(
        files.map(async file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
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
    console.log('Form submitted', formData); // Debug log

    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      // Validaciones detalladas
      const errors = {};
      
      // Validar título
      if (!formData.title?.trim()) {
        errors.title = 'El título es obligatorio';
      } else if (formData.title.length < 10) {
        errors.title = 'El título debe tener al menos 10 caracteres';
      }
      
      // Validar descripción
      if (!formData.description?.trim()) {
        errors.description = 'La descripción es obligatoria';
      } else if (formData.description.length < 20) {
        errors.description = 'La descripción debe tener al menos 20 caracteres';
      }
      
      // Validar precio
      if (!formData.price) {
        errors.price = 'El precio es obligatorio';
      } else if (parseFloat(formData.price) <= 0) {
        errors.price = 'El precio debe ser mayor a 0';
      } else if (isNaN(parseFloat(formData.price))) {
        errors.price = 'El precio debe ser un número válido';
      }
      
      // Validar categoría
      if (!formData.categoryId) {
        errors.categoryId = 'Debe seleccionar una categoría';
      }
      
      // Validar marca
      if (!formData.brand?.trim()) {
        errors.brand = 'La marca es obligatoria';
      }
      
      // Validar modelo
      if (!formData.model?.trim()) {
        errors.model = 'El modelo es obligatorio';
      }
      
      // Validar stock
      if (formData.stock === '') {
        errors.stock = 'El stock es obligatorio';
      } else if (parseInt(formData.stock) < 0) {
        errors.stock = 'El stock no puede ser negativo';
      } else if (isNaN(parseInt(formData.stock))) {
        errors.stock = 'El stock debe ser un número válido';
      }

      // Si hay errores, mostrarlos y detener el envío
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setError('Por favor, complete todos los campos requeridos correctamente');
        setLoading(false);
        console.log('Validation errors:', errors); // Debug log
        return;
      }
      
      // Validar que haya al menos una imagen
      if (formData.images.length === 0) {
        setError('Debe agregar al menos una imagen del producto');
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        categoryId: parseInt(formData.categoryId)
      };

      console.log('Creating product with data:', productData); // Debug log
      
      // Llamar a la función de creación de producto
      const result = await createProduct(productData, user.id);
      console.log('Product creation result:', result); // Debug log
      
      if (result.success) {
        console.log('Product created successfully!', result.product);
        // Mostrar mensaje de éxito y navegar
        setError(null);
        navigate('/my-products', { 
          replace: true,
          state: { message: 'Producto creado exitosamente!' }
        });
      } else {
        console.error('Failed to create product:', result.error);
        throw new Error(result.error || 'Error al crear el producto');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err); // Debug log
      setError(err.message || 'Error al crear el producto');
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
        {/* Información básica */}
        <section className="form-section">
          <h3>Información básica</h3>
          <div className="form-group">
            <Input
              label="Título del producto *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={validationErrors.title}
              disabled={loading}
              required
              placeholder="Ej: Smartphone Samsung Galaxy S21"
            />
          </div>

          <div className="form-group">
            <Input
              type="textarea"
              label="Descripción detallada *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={validationErrors.description}
              disabled={loading}
              required
              placeholder="Describe las características principales, estado y cualquier detalle relevante del producto"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <Input
                type="text"
                label="Marca *"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={validationErrors.brand}
                disabled={loading}
                required
                placeholder="Ej: Samsung"
              />
            </div>

            <div className="form-group">
              <Input
                type="text"
                label="Modelo *"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={validationErrors.model}
                disabled={loading}
                required
                placeholder="Ej: Galaxy S21"
              />
            </div>
          </div>
        </section>

        {/* Precio y stock */}
        <section className="form-section">
          <h3>Precio y disponibilidad</h3>
          <div className="form-row">
            <div className="form-group">
              <Input
                type="number"
                label="Precio *"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={validationErrors.price}
                min="0"
                step="0.01"
                disabled={loading}
                required
                placeholder="Ingresa el precio en $"
              />
            </div>

            <div className="form-group">
              <Input
                type="number"
                label="Stock disponible *"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                error={validationErrors.stock}
                min="0"
                disabled={loading}
                required
                placeholder="Cantidad disponible"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="condition">Estado del producto *</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="new">Nuevo</option>
              <option value="used">Usado</option>
              <option value="refurbished">Reacondicionado</option>
            </select>
          </div>
        </section>

        {/* Categorización */}
        <section className="form-section">
          <h3>Categorización</h3>
          <div className="form-group">
            <label htmlFor="categoryId">Categoría *</label>
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
        </section>

        {/* Dimensiones y peso */}
        <section className="form-section">
          <h3>Dimensiones y peso</h3>
          <div className="form-row">
            <div className="form-group">
              <Input
                type="number"
                label="Ancho (cm)"
                name="dimensions.width"
                value={formData.dimensions.width}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Ancho en cm"
              />
            </div>
            <div className="form-group">
              <Input
                type="number"
                label="Alto (cm)"
                name="dimensions.height"
                value={formData.dimensions.height}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Alto en cm"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <Input
                type="number"
                label="Profundidad (cm)"
                name="dimensions.depth"
                value={formData.dimensions.depth}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Profundidad en cm"
              />
            </div>
            <div className="form-group">
              <Input
                type="number"
                label="Peso (kg)"
                name="dimensions.weight"
                value={formData.dimensions.weight}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Peso en kg"
              />
            </div>
          </div>
        </section>

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
            variant="secondary"
            onClick={() => navigate('/my-products')}
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
            {loading ? 'Creando...' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
