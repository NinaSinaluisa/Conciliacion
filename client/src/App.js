import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PanelPrincipal from './pages/PanelPrincipal';
import Usuarios from './pages/Usuarios';
import ExtractoBancario from './pages/ExtractoBancario';
import RegistroContable from './pages/RegistroContable';
import Conciliaciones from './pages/Conciliaciones';
import Reportes from './pages/Reportes';
import ProtectedRoute from './pages/ProtectedRoute'; // Ruta protegida para los roles
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta para el Panel Principal */}
        <Route path="/panel" element={<PanelPrincipal />}>
          {/* Rutas protegidas bajo el Panel Principal */}
          <Route path="usuarios" element={<ProtectedRoute allowedRoles={['contador']}><Usuarios /></ProtectedRoute>} />
          <Route path="extracto-bancario" element={<ProtectedRoute allowedRoles={['contador']}><ExtractoBancario /></ProtectedRoute>} />
          <Route path="registro-contable" element={<ProtectedRoute allowedRoles={['contador']}><RegistroContable /></ProtectedRoute>} />
          <Route path="conciliaciones" element={<ProtectedRoute allowedRoles={['contador']}><Conciliaciones /></ProtectedRoute>} />
          <Route path="reportes" element={<ProtectedRoute allowedRoles={['contador', 'jefe_contador', 'auditor']}><Reportes /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
