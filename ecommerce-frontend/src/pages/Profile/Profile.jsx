import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { useCart } from '../../context/CartContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { isValidEmail, isValidPassword } from '../../../utils/helpers';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

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

    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    const errors = {};

    // Validar campos básicos
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }

    if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido';
    }

    // Validar contraseñas solo si se está intentando cambiar
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Ingresa tu contraseña actual';
      }

      if (formData.newPassword) {
        const passwordValidation = isValidPassword(formData.newPassword);
        if (!passwordValidation.isValid) {
          errors.newPassword = Object.values(passwordValidation.errors)[0];
        }

        if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
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

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        // Solo incluir contraseña si se está cambiando
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (result.success) {
        setSuccess('Perfil actualizado correctamente');
        setIsEditing(false);
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Error actualizando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
    }
  };

  const getInitials = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {getInitials()}
          </div>
        </div>
        
        <div className="profile-info">
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="username">@{user.username}</p>
          <p className="member-since">
            Miembro desde {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="profile-actions">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <Input
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={validationErrors.firstName}
                disabled={loading}
                required
              />

              <Input
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={validationErrors.lastName}
                disabled={loading}
                required
              />
            </div>

            <Input
              type="email"
              label="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={validationErrors.email}
              disabled={loading}
              required
            />

            <div className="password-section">
              <h3>Cambiar contraseña</h3>
              <p className="helper-text">
                Deja estos campos en blanco si no deseas cambiar tu contraseña
              </p>

              <Input
                type="password"
                label="Contraseña actual"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                error={validationErrors.currentPassword}
                disabled={loading}
              />

              <Input
                type="password"
                label="Nueva contraseña"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                error={validationErrors.newPassword}
                disabled={loading}
              />

              <Input
                type="password"
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={validationErrors.confirmPassword}
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={loading}
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-group">
              <h3>Información Personal</h3>
              <div className="detail-row">
                <span className="detail-label">Nombre completo:</span>
                <span className="detail-value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Usuario:</span>
                <span className="detail-value">@{user.username}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Miembro desde:</span>
                <span className="detail-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="detail-group">
              <h3>Actividad</h3>
              <div className="detail-row">
                <span className="detail-label">Productos publicados:</span>
                <span className="detail-value">12</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Productos vendidos:</span>
                <span className="detail-value">8</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Última venta:</span>
                <span className="detail-value">Hace 2 días</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
