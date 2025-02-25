import express from 'express';
import conciliacionController from '../controllers/conciliacionController.js';

const router = express.Router();

router.get('/', conciliacionController.getConciliaciones);
router.get('/:id', conciliacionController.getConciliacionById);
router.post('/', conciliacionController.createConciliacion);
router.post('/generar', conciliacionController.generarConciliacion); // Si existe
router.put('/:id', conciliacionController.updateConciliacion);
router.delete('/:id', conciliacionController.deleteConciliacion);

export default router;
