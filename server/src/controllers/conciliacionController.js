import conciliacionService from '../services/conciliacionService.js';

const conciliacionController = {
  getConciliaciones: async (req, res) => {
    try {
      const conciliaciones = await conciliacionService.obtenerConciliaciones();
      res.json(conciliaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las conciliaciones', message: error.message });
    }
  },

  getConciliacionById: async (req, res) => {
    try {
      const { id } = req.params;
      const conciliacion = await conciliacionService.obtenerConciliacionPorId(id);
      if (!conciliacion) return res.status(404).json({ error: 'Conciliación no encontrada' });
      res.json(conciliacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la conciliación', message: error.message });
    }
  },

  createConciliacion: async (req, res) => {
    try {
      const { periodo } = req.body;
      if (!periodo) {
        return res.status(400).json({ error: 'El periodo es requerido' });
      }
  
      const nuevaConciliacion = await conciliacionService.crearConciliacion(periodo);
      res.status(201).json(nuevaConciliacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la conciliación', message: error.message });
    }
  },
  
  updateConciliacion: async (req, res) => {
    try {
      const { id } = req.params; // Aquí obtenemos el id
      const conciliacionActualizada = await conciliacionService.actualizarConciliacion(id, req.body); // Usamos el id
      if (!conciliacionActualizada) return res.status(404).json({ error: 'Conciliación no encontrada' });
      res.json(conciliacionActualizada);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la conciliación', message: error.message });
    }
  },
  

  deleteConciliacion: async (req, res) => {
    try {
      const { id } = req.params;
      const conciliacionEliminada = await conciliacionService.eliminarConciliacion(id);
      if (!conciliacionEliminada) return res.status(404).json({ error: 'Conciliación no encontrada' });
      res.json({ message: 'Conciliación eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la conciliación', message: error.message });
    }
  },

  generarConciliacion: async (req, res) => {
    try {
      const { periodo } = req.body;
      
      if (!periodo) {
        return res.status(400).json({ error: 'El periodo es obligatorio para generar la conciliación' });
      }

      const conciliacion = await conciliacionService.generarConciliacion(periodo);
      res.status(201).json(conciliacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al generar la conciliación', message: error.message });
    }
  },
};

export default conciliacionController;
