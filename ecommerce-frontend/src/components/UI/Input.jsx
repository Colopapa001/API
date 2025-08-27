import React, { useState, forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  label = '',
  placeholder = '',
  value = '',
  error = '',
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'medium',
  icon = null,
  iconPosition = 'left',
  showPassword = false,
  helperText = '',
  maxLength,
  minLength,
  pattern,
  onChange,
  onBlur,
  onFocus,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generar ID único si no se proporciona
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  // Construir clases CSS
  const containerClasses = [
    'input-container',
    `input-size-${size}`,
    fullWidth ? 'input-full-width' : '',
    error ? 'input-error' : '',
    disabled ? 'input-disabled' : '',
    isFocused ? 'input-focused' : '',
    icon ? `input-with-icon input-icon-${iconPosition}` : '',
    className
  ].filter(Boolean).join(' ');

  // Manejar cambio de valor
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  // Manejar focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  // Manejar blur
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // Toggle para mostrar/ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPasswordToggle(!showPasswordToggle);
  };

  // Determinar el tipo de input actual
  const currentType = type === 'password' && showPasswordToggle ? 'text' : type;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="input-wrapper">
        {/* Icono izquierdo */}
        {icon && iconPosition === 'left' && (
          <div className="input-icon-container input-icon-left">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={currentType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className="input-field"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {/* Icono derecho */}
        {icon && iconPosition === 'right' && (
          <div className="input-icon-container input-icon-right">
            {icon}
          </div>
        )}

        {/* Toggle para password */}
        {type === 'password' && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPasswordToggle ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <div className="input-helper-text">{helperText}</div>
      )}

      {/* Error Message */}
      {error && (
        <div className="input-error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;