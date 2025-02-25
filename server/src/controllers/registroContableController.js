import RegistroContableService from '../services/registroContableService.js';

class RegistroContableController {
  async obtenerRegistros(req, res) {
    try {
      const registros = await RegistroContableService.obtenerRegistros();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los registros contables.' });
    }
  }

  async obtenerRegistroPorId(req, res) {
    try {
      const { id } = req.params;
      const registro = await RegistroContableService.obtenerRegistroPorId(id);
      if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el registro contable.' });
    }
  }

  // Permite recibir JSON ya sea con un objeto o un array de registros
  async crearRegistro(req, res) {
    try {
      // Aquí puedes optar por recibir directamente el objeto o, si lo prefieres, envolverlo en una propiedad "datos"
      // Por ejemplo: const { datos } = req.body; y luego enviar "datos" al servicio.
      const nuevoRegistro = await RegistroContableService.crearRegistro(req.body);
      res.status(201).json(nuevoRegistro);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el registro contable, o ya existe', details: error.message });
    }
  }

  async actualizarRegistro(req, res) {
    try {
      const { id } = req.params;
      const registroActualizado = await RegistroContableService.actualizarRegistro(id, req.body);
      if (!registroActualizado) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(registroActualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el registro contable.' });
    }
  }

  async eliminarRegistro(req, res) {
    try {
      const { id } = req.params;
      const registroEliminado = await RegistroContableService.eliminarRegistro(id);
      if (!registroEliminado) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el registro contable.' });
    }
  }

  //Función para subir archivo CSV
  async subirRegistros(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
      }

      const resultados = await RegistroContableService.procesarArchivoCSV(req.file.path);
      res.status(201).json({ message: 'Registros contables cargados exitosamente.', data: resultados });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir el archivo CSV.', error: error.message });
    }
  }
}

export default new RegistroContableController();
