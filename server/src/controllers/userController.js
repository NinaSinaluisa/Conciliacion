// src/controllers/userController.js
import userService from '../services/userService.js'; // Importar el servicio
import jwt from 'jsonwebtoken'; // Si necesitas generar tokens para autenticación

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    // Llamamos al servicio con los datos del body de la solicitud
    const nuevoUsuario = await userService.createUser(req.body);
    // Respondemos con el usuario creado
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    // En caso de error, respondemos con el mensaje de error
    res.status(400).json({ error: error.message });
  }
};

// Método getUsers
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();  // Cambié getUsers() por getAllUsers()
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);  // Agregué un console.log para ver el error
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserByIdService(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};


// Otras funciones como createUser, getAllUsers, etc.

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await userService.deleteUserService(id);  // Llamamos al servicio que manejará la eliminación
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se ingresaron ambos campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Se requieren el correo electrónico y la contraseña.' });
    }

    // Llamar al servicio para autenticar al usuario
    const response = await userService.loginUsuario({ email, password });

    // Responder con los datos del usuario autenticado
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error en login:', error);
    
    // Si el error es "Correo o contraseña incorrectos", enviar un 401
    if (error.message === 'Correo o contraseña incorrectos.') {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // En caso de error interno del servidor
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
