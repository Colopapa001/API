import React from 'react';
import './SortBy.css';

const SortBy = ({ value, onChange }) => {
  return (
    <div className="sort-by">
      <label htmlFor="sort-select">Ordenar por:</label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sort-by__select"
      >
        <option value="newest">Más recientes</option>
        <option value="price-asc">Precio: Menor a Mayor</option>
        <option value="price-desc">Precio: Mayor a Menor</option>
        <option value="name-asc">Nombre: A-Z</option>
        <option value="name-desc">Nombre: Z-A</option>
        <option value="stock-desc">Mayor stock</option>
      </select>
    </div>
  );
};

export default SortBy;
