// src/controllers/extractoBancarioController.js
import ExtractoBancarioService from '../services/extractoBancarioService.js';

export const getExtractos = async (req, res) => {
  try {
    const extractos = await ExtractoBancarioService.obtenerExtractos();
    res.json(extractos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los extractos bancarios' });
  }
};

export const getExtractoById = async (req, res) => {
  try {
    const { id } = req.params;
    const extracto = await ExtractoBancarioService.obtenerExtractoPorId(id);
    if (!extracto) return res.status(404).json({ error: 'Extracto no encontrado' });
    res.json(extracto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el extracto' });
  }
};

export const createExtracto = async (req, res) => {
  try {
    const { datos } = req.body; // Se espera que "datos" sea un array o un objeto
    if (!datos || (Array.isArray(datos) && datos.length === 0)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud no contiene datos válidos.' });
    }

    const resultado = await ExtractoBancarioService.crearExtracto(datos);
    res.status(201).json({ message: 'Extracto(s) creado(s) exitosamente.', data: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear los extractos', details: error.message });
  }
};


export const updateExtracto = async (req, res) => {
  try {
    const { id } = req.params;
    const extractoActualizado = await ExtractoBancarioService.actualizarExtracto(id, req.body);
    if (!extractoActualizado) return res.status(404).json({ error: 'Extracto no encontrado' });
    res.json(extractoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el extracto' });
  }
};

export const deleteExtracto = async (req, res) => {
  try {
    const { id } = req.params;
    const extractoEliminado = await ExtractoBancarioService.eliminarExtracto(id);
    if (!extractoEliminado) return res.status(404).json({ error: 'Extracto no encontrado' });
    res.json({ message: 'Extracto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el extracto' });
  }
};

// Nueva función para subir archivo CSV
export const subirExtracto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const extension = req.file.originalname.split('.').pop().toLowerCase();
    const formatosPermitidos = ['csv', 'txt', 'log'];

    if (!formatosPermitidos.includes(extension)) {
      return res.status(400).json({ message: 'Formato de archivo no permitido.' });
    }

    const resultados = await ExtractoBancarioService.subirExtracto(req.file.path);
    res.status(201).json({ message: 'Extracto bancario cargado exitosamente.', data: resultados });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({ message: 'Error al subir el extracto bancario.', error: error.message });
  }
};
