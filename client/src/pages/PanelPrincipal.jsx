import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../utils/PanelPrincipal.css';

const PanelPrincipal = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

 // Cargar el usuario desde localStorage
 useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Recuperar el objeto completo
    console.log("Usuario en localStorage:", storedUser); // Verifica lo que hay en localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Si hay usuario, lo parseamos
    } else {
      navigate('/'); // Redirige si no hay usuario
    }
  }, [navigate]);
  
  

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="panel-principal">
      <div className="sidebar">
        <h2>Menú</h2>
        <ul>
            <li><button onClick={() => navigate('/panel')}>Inicio</button></li>
            <li><button onClick={() => navigate('/panel/usuarios')}>Usuarios</button></li>
            <li><button onClick={() => navigate('/panel/extracto-bancario')}>Extracto Bancario</button></li>
            <li><button onClick={() => navigate('/panel/registro-contable')}>Registro Contable</button></li>
            <li><button onClick={() => navigate('/panel/conciliaciones')}>Conciliaciones</button></li>
            <li><button onClick={() => navigate('/panel/reportes')}>Reportes</button></li>

        </ul>
      </div>
      <div className="content">
        <div className="header">
          <span>Bienvenido, {user?.name || 'Usuario'}</span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <div className="main-content">
          {location.pathname === '/panel' && <h2> <br />Sistema de conciliacion Bancaria <br /> <h3>Genera el proceso de conciliacion de manera eficiente y en menor tiempo.</h3></h2>  }
 
          <Outlet />
          
        </div>
                               
      </div>
    </div>
  );
};

export default PanelPrincipal;