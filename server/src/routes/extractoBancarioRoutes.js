// src/routes/extractoBancarioRoutes.js
import express from 'express';
import * as extractoController from '../controllers/extractoBancarioController.js';
import upload from '../middlewares/uploadMiddleware.js'; // Middleware para manejar archivos

const router = express.Router();

// Rutas existentes
router.get('/', extractoController.getExtractos);
router.get('/:id', extractoController.getExtractoById);
router.post('/', extractoController.createExtracto);
router.put('/:id', extractoController.updateExtracto);
router.delete('/:id', extractoController.deleteExtracto);

// Nueva ruta para subir archivo CSV
router.post('/subir', upload.single('archivo'), extractoController.subirExtracto);

export default router;