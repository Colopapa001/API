import React from 'react';
import Input from '../UI/Input';
import './Filters.css';

const Filters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="filters">
      <h3 className="filters__title">Filtros</h3>
      <div className="filters__content">
        <div className="filter-group">
          <label>Buscar por nombre:</label>
          <Input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Buscar productos..."
          />
        </div>

        <div className="filter-group">
          <label>Categorías:</label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            <option value="1">Electrónicos</option>
            <option value="2">Ropa</option>
            <option value="3">Hogar</option>
            <option value="4">Deportes</option>
            <option value="5">Libros</option>
            <option value="6">Juguetes</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Rango de precios:</label>
          <div className="price-range">
            <Input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Mín"
              min="0"
            />
            <span className="price-range-separator">-</span>
            <Input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Máx"
              min="0"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
            />
            <span>Solo productos en stock</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Filters;
