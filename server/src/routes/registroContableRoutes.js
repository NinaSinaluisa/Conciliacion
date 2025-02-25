import express from 'express';
import RegistroContableController from '../controllers/registroContableController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rutas CRUD
router.get('/', RegistroContableController.obtenerRegistros);
router.get('/:id', RegistroContableController.obtenerRegistroPorId);
router.post('/', RegistroContableController.crearRegistro);
router.put('/:id', RegistroContableController.actualizarRegistro);
router.delete('/:id', RegistroContableController.eliminarRegistro);

// Nueva ruta para subir archivo CSV
router.post('/subir', upload.single('archivo'), RegistroContableController.subirRegistros);

export default router;
