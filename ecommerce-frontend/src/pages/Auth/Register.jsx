import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { isValidPassword, isValidEmail, isValidUsername } from '../../utils/helpers';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Validar username
    const usernameValidation = isValidUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = Object.values(usernameValidation.errors)[0];
    }

    // Validar email
    if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido';
    }

    // Validar password
    const passwordValidation = isValidPassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = Object.values(passwordValidation.errors)[0];
    }

    // Validar confirmación de password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar nombre y apellido
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <Input
              name="firstName"
              label="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              error={validationErrors.firstName}
              disabled={isLoading}
              required
            />

            <Input
              name="lastName"
              label="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              error={validationErrors.lastName}
              disabled={isLoading}
              required
            />
          </div>

          <Input
            name="username"
            label="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            error={validationErrors.username}
            disabled={isLoading}
            required
          />

          <Input
            type="email"
            name="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            disabled={isLoading}
            required
          />

          <Input
            type="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
            helperText="Mínimo 6 caracteres, al menos una letra y un número"
            disabled={isLoading}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={validationErrors.confirmPassword}
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
          >
            Registrarse
          </Button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
