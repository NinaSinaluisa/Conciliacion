// src/services/conciliacionService.js
import { Conciliacion } from '../models/Conciliacion.js';
import { ExtractoBancario } from '../models/ExtractoBancario.js';
import { RegistroContable } from '../models/RegistroContable.js';

class ConciliacionService {
  // Obtener todas las conciliaciones
  async obtenerConciliaciones() {
    try {
      // Solo obtener los registros de la tabla conciliacion
      return await Conciliacion.findAll();
    } catch (error) {
      console.error('Error al obtener conciliaciones:', error);
      throw new Error('Error al obtener las conciliaciones.');
    }
  }
  

  // Obtener una conciliación por ID
  async obtenerConciliacionPorId(id) {
    try {
      const conciliacion = await Conciliacion.findByPk(id, {
        include: [ExtractoBancario, RegistroContable],
      });
      if (!conciliacion) {
        throw new Error('Conciliación no encontrada.');
      }
      return conciliacion;
    } catch (error) {
      console.error('Error al obtener conciliación:', error);
      throw new Error('Error al obtener la conciliación.');
    }
  }
// Crear una nueva conciliación
async crearConciliacion(periodo) {
  try {
    // Verificar si ya existe una conciliación para el periodo
    const existeConciliacion = await Conciliacion.findOne({ where: { periodo } });
    if (existeConciliacion) {
      throw new Error('Ya existe una conciliación para este periodo.');
    }

    // Verificar si existen extractos bancarios y registros contables para el periodo
    const extractos = await ExtractoBancario.findAll({ where: { periodo } });
    const registros = await RegistroContable.findAll({ where: { periodo } });

    if (extractos.length === 0 || registros.length === 0) {
      throw new Error('No existen extractos bancarios o registros contables para este periodo.');
    }

    // Generar la conciliación con los datos de extractos y registros contables
    const datosConciliacion = await this.generarConciliacion(periodo);

    // Guardar la conciliación en la base de datos
    return await Conciliacion.create(datosConciliacion);
  } catch (error) {
    console.error('Error al crear conciliación:', error);
    throw new Error('Error al crear la conciliación.');
  }
}

async actualizarConciliacion(id, conciliacionData) {
  try {
    // Verificar si ya existe una conciliación para este id
    const conciliacionExistente = await Conciliacion.findOne({ where: { id } });

    if (!conciliacionExistente) {
        throw new Error('No se encontró conciliación para este id.');
    }

    // Actualizar la conciliación con todos los valores proporcionados
    await Conciliacion.update(
      {
        saldoSegunBancos: conciliacionData.saldoSegunBancos,
        saldoSegunLibros: conciliacionData.saldoSegunLibros,
        diferencia: conciliacionData.diferencia,
        cargosBancoNoEmpresa: conciliacionData.cargosBancoNoEmpresa,
        cargosEmpresaNoBanco: conciliacionData.cargosEmpresaNoBanco,
        abonosBancoNoEmpresa: conciliacionData.abonosBancoNoEmpresa,
        abonosEmpresaNoBanco: conciliacionData.abonosEmpresaNoBanco
      }, 
      {
        where: { id },  // Buscar por id
      }
    );

    // Retornar la conciliación actualizada con la estructura deseada
    return {
        id,  // Cambiado a id en lugar de periodo
        saldoSegunBancos: conciliacionData.saldoSegunBancos,
        cargosBancoNoEmpresa: conciliacionData.cargosBancoNoEmpresa,
        cargosEmpresaNoBanco: conciliacionData.cargosEmpresaNoBanco,
        abonosBancoNoEmpresa: conciliacionData.abonosBancoNoEmpresa,
        abonosEmpresaNoBanco: conciliacionData.abonosEmpresaNoBanco,
        saldoSegunLibros: conciliacionData.saldoSegunLibros,
        diferencia: conciliacionData.diferencia
    };
  } catch (error) {
    console.error('Error al actualizar conciliación:', error);
    throw new Error('Error al actualizar la conciliación.');
  }
}


  // Eliminar una conciliación
  async eliminarConciliacion(id) {
    try {
      const conciliacion = await Conciliacion.findByPk(id);
      if (!conciliacion) {
        throw new Error('Conciliación no encontrada.');
      }
      if (conciliacion.estado === 'aprobado') {
        throw new Error('No se puede eliminar una conciliación aprobada.');
      }
      await conciliacion.destroy();
      return conciliacion;
    } catch (error) {
      console.error('Error al eliminar conciliación:', error);
      throw new Error('Error al eliminar la conciliación.');
    }
  }

  async generarConciliacion(periodo) {
    try {
      const extractos = await ExtractoBancario.findAll({ where: { periodo } });
      const registros = await RegistroContable.findAll({ where: { periodo } });
  
      if (extractos.length === 0 || registros.length === 0) {
        throw new Error('No hay datos suficientes para generar la conciliación.');
      }
  
      // Calcular saldo según bancos y saldo según libros
      const saldoFinalBanco = extractos.reduce((total, e) => total + (e.abonos || 0) - (e.cargos || 0), 0);
      const saldoFinalLibros = registros.reduce((total, r) => total + (r.abonos || 0) - (r.cargos || 0), 0);
  
      // Determinar los cargos y abonos no registrados
      const cargosBancoNoEmpresa = extractos
        .filter(e => !registros.some(r => r.concepto === e.concepto && (r.cargos || 0) === (e.cargos || 0)))
        .map(e => ({ fecha: e.fecha, concepto: e.concepto, importe: e.cargos || 0 }));
  
      const cargosEmpresaNoBanco = registros
        .filter(r => !extractos.some(e => e.concepto === r.concepto && (e.cargos || 0) === (r.cargos || 0)))
        .map(r => ({ fecha: r.fecha, concepto: r.concepto, importe: r.cargos || 0 }));
  
      const abonosBancoNoEmpresa = extractos
        .filter(e => !registros.some(r => r.concepto === e.concepto && (r.abonos || 0) === (e.abonos || 0)))
        .map(e => ({ fecha: e.fecha, concepto: e.concepto, importe: e.abonos || 0 }));
  
      const abonosEmpresaNoBanco = registros
        .filter(r => !extractos.some(e => e.concepto === r.concepto && (e.abonos || 0) === (r.abonos || 0)))
        .map(r => ({ fecha: r.fecha, concepto: r.concepto, importe: r.abonos || 0 }));
  
      // Calcular la diferencia
      const diferencia = saldoFinalBanco - saldoFinalLibros;
  
      // Buscar extracto y registro para obtener sus IDs
      const extractoBancario = extractos[0]; // Tomamos el primer extracto como ejemplo
      const registroContable = registros[0]; // Tomamos el primer registro como ejemplo
  
      if (!extractoBancario || !registroContable) {
        throw new Error('No se encontró un extracto bancario o registro contable válido.');
      }
  
      // Formato del reporte
      const reporteConciliacion = {
        periodo,
        saldoSegunBancos: saldoFinalBanco,
        cargosBancoNoEmpresa,
        cargosEmpresaNoBanco,
        abonosBancoNoEmpresa,
        abonosEmpresaNoBanco,
        saldoSegunLibros: saldoFinalLibros,
        diferencia,
        extractoBancarioId: extractoBancario.id, // Asignar el ID del extracto bancario
        registroContableId: registroContable.id, // Asignar el ID del registro contable
      };
  
      return reporteConciliacion;
    } catch (error) {
      console.error('Error al generar conciliación:', error);
      throw new Error('Error al generar la conciliación.');
    }
  }
  
}

export default new ConciliacionService();
