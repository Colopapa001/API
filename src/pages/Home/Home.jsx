import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Filters from '../../components/Filters/Filters';
import SortBy from '../../components/SortBy/SortBy';
import { mockProducts } from '../../utils/mockData';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest'
  });

  const { addToCart, isLoading: isCartLoading } = useCart();

  // Cargar productos
  const { user } = useAuth(); // Añadir esta línea

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Si el usuario está autenticado, filtrar sus productos
        let filteredProducts = [...mockProducts];
        
        if (user) {
          console.log('Usuario autenticado:', user.id);
          console.log('Productos antes de filtrar:', filteredProducts.length);
          
          filteredProducts = filteredProducts.filter(product => {
            const isUserProduct = product.userId === user.id;
            if (isUserProduct) {
              console.log('Excluyendo producto del usuario:', product.title);
            }
            return !isUserProduct;
          });
          
          console.log('Productos después de filtrar:', filteredProducts.length);
        }

        // Ordenar por más recientes primero
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(filteredProducts);
        setError(null);
      } catch (err) {
        setError('Error cargando productos');
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user]);

  // Manejar cambios en filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Aplicar filtros
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por categoría
    if (filters.categoryId) {
      filtered = filtered.filter(product => 
        product.categoryId === parseInt(filters.categoryId)
      );
    }

    // Filtrar por precio
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Filtrar por stock
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Ordenar productos
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  // Manejar agregar al carrito
  const handleAddToCart = async (product) => {
    const result = await addToCart(product);
    if (result.success) {
      // Aquí podrías mostrar una notificación de éxito
    }
  };

  if (loading) {
    return (
      <div className="home-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <div className="home">
      <div className="home-header">
        <div className="search-filters-container">
          <div className="filters-section">
            <Filters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="sort-section">
            <SortBy
              value={filters.sortBy}
              onChange={(value) => handleFilterChange({...filters, sortBy: value})}
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="home-empty">
          <h2>No se encontraron productos</h2>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="home-products">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => handleAddToCart(product)}
              loading={isCartLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
