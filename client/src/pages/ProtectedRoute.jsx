import React from 'react';
import { Navigate } from 'react-router-dom';
import { AiOutlineWarning } from 'react-icons/ai';
import '../utils/ProtectedRoute.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = localStorage.getItem('user'); // Asegurar que se usa la misma clave
  const user = storedUser ? JSON.parse(storedUser) : null; // Parsear correctamente

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied-container">
        <AiOutlineWarning style={{ fontSize: '40px', marginRight: '10px', verticalAlign: 'middle' }} />
        <h2 style={{ display: 'inline' }}>Acceso Denegado</h2>
        <p className="denied-message">No tienes permisos suficientes para acceder a esta sección.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
