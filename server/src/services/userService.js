import { User } from '../models/User.js';  
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno

const SECRET_KEY = process.env.JWT_SECRET || 'secreto'; // Usa variables de entorno

class UserService {
  // Validaciones 
  validateUserData(data, isUpdate = false) {
    const { name, email, password, role } = data;

    if (!name) {
      throw new Error('El nombre es obligatorio.');
    }    

    if (!email || !email.includes('@')) {
      throw new Error('El correo electrónico debe ser válido.');
    }

    if (!isUpdate && (!password || password.length < 4)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    if (!role || !['contador', 'jefe_contador', 'auditor'].includes(role)) {
      throw new Error('El rol debe ser uno de: contador, jefe_contador, auditor.');
    }
  }

  // Crear un nuevo usuario
  async createUser(data) {
    try {
      this.validateUserData(data);  

      // Verificar si el email ya existe
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado.');
      }

      // Encriptar la contraseña
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });

      return user;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  // Autenticar un usuario y generar un token
  async loginUsuario(data) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    const token = jwt.sign(
      { id: existingUser.id, role: existingUser.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' } 
    );

    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      token, 
    };
  }

  // Obtener todos los usuarios (según permisos)
  async getAllUsers() {
    try {
      console.log('Intentando obtener todos los usuarios...');
      const users = await User.findAll();  // Asegúrate de que 'User' esté correctamente importado
      if (!users.length) {
        throw new Error('No hay usuarios en la base de datos');
      }
      return users;
    } catch (error) {
      console.error('Error en getAllUsers:', error);  // Agregar log para identificar el error
      throw new Error(`Error en getAllUsers: ${error.message}`);
    }
  }


  // Obtener un usuario por ID
  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }, // No enviar la contraseña
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  // Eliminar un usuario
  async deleteUserService(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.destroy();  
  }
}

export default new UserService();
