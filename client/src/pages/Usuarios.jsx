import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../utils/Usuarios.css';

const API_URL_USUARIOS = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/usuarios` 
  : 'http://localhost:4000/usuarios';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    name: '',
    email: '',
    password: '',
    role: 'contador',
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editUsuario, setEditUsuario] = useState(null); // Para editar un usuario
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);


  useEffect(() => {
    fetchUsuarios();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUsuarios = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(API_URL_USUARIOS, { headers });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios data:', error.response?.data || error);
    }
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = newUsuario;

    if (!name || !email || !password) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    try {
      const headers = getAuthHeaders();
      await axios.post(API_URL_USUARIOS, newUsuario, { headers });
      fetchUsuarios();
      handleCloseModal();
    } catch (error) {
      setErrorMessage('Error al agregar el usuario.');
    }
  };

  const handleEditUsuario = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = editUsuario;

    if (!name || !email || !password) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    try {
      const headers = getAuthHeaders();
      await axios.put(`${API_URL_USUARIOS}/${editUsuario.id}`, editUsuario, { headers });
      fetchUsuarios();
      setEditUsuario(null);
      handleCloseModal();
    } catch (error) {
      setErrorMessage('Error al actualizar el usuario.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${API_URL_USUARIOS}/${usuarioAEliminar.id}`, { headers });
      fetchUsuarios();
      handleCloseConfirmModal();  // Cerrar la modal después de eliminar
    } catch (error) {
      console.error('Error deleting usuario:', error);
    }
  };
  

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setUsuarioAEliminar(null);  // Limpiar el usuario seleccionado
  };
  
  const handleOpenConfirmModal = (usuario) => {
    setUsuarioAEliminar(usuario);  // Guardamos el usuario que se va a eliminar
    setShowConfirmModal(true);  // Mostramos el modal de confirmación
  };
  

  const handleOpenModal = (usuario = null) => {
    setErrorMessage('');
    setEditUsuario(usuario ? { ...usuario } : null);
    setNewUsuario({
      name: '',
      email: '',
      password: '',
      role: 'contador',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
    setEditUsuario(null);
  };

  return (
    <div className="usuarios-panel">
      <div className="header-buttons">
        <Button variant="primary" onClick={() => handleOpenModal()}>+ Nuevo Usuario</Button>
      </div>

      <h2>Gestión de Usuarios</h2>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleOpenModal(usuario)}>Editar</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleOpenConfirmModal(usuario)}>Eliminar</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editUsuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <Form onSubmit={editUsuario ? handleEditUsuario : handleAddUsuario}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editUsuario ? editUsuario.name : newUsuario.name}
                onChange={(e) => (editUsuario ? setEditUsuario({ ...editUsuario, name: e.target.value }) : setNewUsuario({ ...newUsuario, name: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUsuario ? editUsuario.email : newUsuario.email}
                onChange={(e) => (editUsuario ? setEditUsuario({ ...editUsuario, email: e.target.value }) : setNewUsuario({ ...newUsuario, email: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={editUsuario ? editUsuario.password : newUsuario.password}
                onChange={(e) => (editUsuario ? setEditUsuario({ ...editUsuario, password: e.target.value }) : setNewUsuario({ ...newUsuario, password: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={editUsuario ? editUsuario.role : newUsuario.role}
                onChange={(e) => (editUsuario ? setEditUsuario({ ...editUsuario, role: e.target.value }) : setNewUsuario({ ...newUsuario, role: e.target.value }))}
              >
                <option value="contador">Contador</option>
                <option value="jefe_contador">Jefe Contador</option>
                <option value="auditor">Auditor</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">{editUsuario ? 'Actualizar' : 'Agregar'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>¿Estás seguro de que quieres eliminar este usuario?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseConfirmModal}>
      Cancelar
    </Button>
    <Button variant="danger" onClick={handleConfirmDelete}>
      Eliminar
    </Button>
  </Modal.Footer>
</Modal>
 
    </div>
    
  );
};

export default Usuarios;
