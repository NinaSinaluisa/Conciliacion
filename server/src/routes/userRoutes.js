// src/routes/userRoutes.js
import { Router } from 'express';
import {
  getUsers,  // Cambiado de getAllUsers a getUsers
  getUserById,
  createUser,
  //updateUser,
  deleteUser,  // Ahora está exportada correctamente
  loginUsuario,
} from '../controllers/userController.js';  // Importar los controladores
import authMiddleware from '../middlewares/authMiddleware.js';  // Middleware de autenticación

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware, getUsers);  // Aquí ahora usa getUsers
router.get('/:id', authMiddleware, getUserById);
//router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);  // Ruta para eliminar un usuario

// Rutas públicas
// Rutas públicas
router.post("/login", loginUsuario);
router.post('/', createUser);

export default router;
