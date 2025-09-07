import React from 'react';

const LoadingSpinner = ({ 
  size = 'large', 
  text = 'Cargando...', 
  fullscreen = true,
  color = 'primary'
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    dark: 'spinner-dark'
  };

  if (fullscreen) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
          <div className="loading-text">{text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-spinner-inline">
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && <span className="loading-text-inline">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;