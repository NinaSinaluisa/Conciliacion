import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../utils/LoginPage.css';

const API_URL_USUARIOS = 'http://localhost:4000/usuarios'; // Cambia la URL si es necesario

const LoginPage = () => {

  const navigate = useNavigate(); // Hook para redireccionar
  const [showRegister, setShowRegister] = useState(false);
  const handleShowRegister = () => setShowRegister(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCloseRegister = () => {
    setShowRegister(false);
    setSuccessMessage('');
    setErrorMessage('');
    setNewUsuario({ name: '', email: '', password: '', role: 'contador' }); // Resetear el formulario
  };

  const [newUsuario, setNewUsuario] = useState({
    name: '',
    email: '',
    password: '',
    role: 'contador',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Manejar el submit del login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); 
  
    // Mostrar los datos que se están enviando en la consola
    console.log('Datos enviados al backend:', { 
      email, 
      password 
    });
  
    try {
      const response = await axios.post(`${API_URL_USUARIOS}/login`, { 
        email,  // Cambié 'usuario' por 'email' para coincidir con el backend
        password  // Cambié 'contrasenia' por 'password' para coincidir con el backend
      }, {
        withCredentials: true, 
      });
  
      if (response.status === 200) {
        const { token, id_usuario, name, role } = response.data;
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify({ id_usuario, name, role }));
  
        navigate('/panel'); // Redirigir al panel principal
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
  
      // Aquí simplificamos el manejo de errores
      if (error.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('Hubo un error al intentar iniciar sesión');
      }
    }
  };
  

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(API_URL_USUARIOS, { headers: getAuthHeaders() });
      console.log(response.data); // Esto solo muestra los usuarios en la consola
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = newUsuario;

    if (!name || !email || !password || !role) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    try {
      const headers = getAuthHeaders();
      console.log('Enviando usuario al backend:', newUsuario);

      const response = await axios.post(API_URL_USUARIOS, newUsuario, { headers });

      console.log('Respuesta del servidor:', response.data);

      setSuccessMessage('Usuario agregado correctamente.'); // Mensaje de éxito
      setErrorMessage(''); // Limpiar errores si los hay
    } catch (error) {
      console.error('Error adding usuario:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      }
      setErrorMessage('Error al agregar el usuario.');
    }
  };

  return (
    <div className="container mt-6">
      <div className="row justify-content-center">
        <div className="col-md-20">
          <div className="card p-4">
            <h2 className="text-center">Iniciar Sesión</h2>
            <Form onSubmit={handleSubmit}>  {/* Aquí se llama a handleSubmit */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Ingrese su correo" 
                  value={email}  
                  onChange={(e) => setEmail(e.target.value)}  
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Ingrese su contraseña" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}  
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>
            {error && <p className="text-danger text-center mt-2">{error}</p>}
            <div className="text-center mt-3">
              <p>
                ¿No tienes cuenta?{' '}
                <Button variant="link" onClick={handleShowRegister}>
                  Regístrate aquí
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>Registro de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}

          {!successMessage && ( 
            <Form onSubmit={handleAddUsuario}>
              <Form.Group className="mb-3" controlId="registerName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Ingrese su nombre"
                  value={newUsuario.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Ingrese su correo"
                  value={newUsuario.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  value={newUsuario.password}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerRole">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={newUsuario.role}
                  onChange={handleInputChange}
                >
                  <option value="contador">Contador</option>
                  <option value="jefe_contador">Jefe Contador</option>
                  <option value="auditor">Auditor</option>
                </Form.Control>
              </Form.Group>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <Button variant="primary" type="submit" className="w-100">
                Registrarse
              </Button>
            </Form>
          )}

          {successMessage && (
            <Button variant="secondary" onClick={handleCloseRegister} className="w-100 mt-3">
              Salir
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginPage;
