import { ExtractoBancario } from '../models/ExtractoBancario.js';
import csv from 'csv-parser';
import fs from 'fs';
import moment from 'moment';


class ExtractoBancarioService {
  // Obtener todos los extractos
  async obtenerExtractos() {
    return await ExtractoBancario.findAll();
  }

  // Obtener un extracto por ID
  async obtenerExtractoPorId(id) {
    return await ExtractoBancario.findByPk(id);
  }

 // Crear uno o más extractos
  async crearExtracto(datos) {
    if (Array.isArray(datos)) {
      const registrosProcesados = datos.map(registro => {
        const fechaParsed = moment(registro.fecha, "DD/MM/YYYY", true);
        return {
          fecha: fechaParsed.isValid() ? fechaParsed.toDate() : null,
          concepto: registro.concepto || '',
          cargos: registro.cargos && registro.cargos.trim() !== '' ? parseFloat(registro.cargos) : 0,
          abonos: registro.abonos && registro.abonos.trim() !== '' ? parseFloat(registro.abonos) : 0,
          saldo: registro.saldo && registro.saldo.trim() !== '' ? parseFloat(registro.saldo) : 0,
          // Se asigna un valor por defecto de "Descon" (6 caracteres) para cumplir con el límite de 7 caracteres
          periodo: registro.periodo && registro.periodo.trim() !== '' ? registro.periodo : 'Descon'
        };
      });

      // Validamos el periodo si no es el valor por defecto
      if (registrosProcesados[0]?.periodo && registrosProcesados[0].periodo !== 'Descon') {
        const existePeriodo = await ExtractoBancario.findOne({ where: { periodo: registrosProcesados[0].periodo } });
        if (existePeriodo) {
          throw new Error(`Ya existe un extracto bancario con el periodo ${registrosProcesados[0].periodo}.`);
        }
      }

      return await ExtractoBancario.bulkCreate(registrosProcesados);
    } else {
      // Para un solo objeto
      const fechaParsed = moment(datos.fecha, "DD/MM/YYYY", true);
      const registro = {
        fecha: fechaParsed.isValid() ? fechaParsed.toDate() : null,
        concepto: datos.concepto || '',
        cargos: datos.cargos && datos.cargos.trim() !== '' ? parseFloat(datos.cargos) : 0,
        abonos: datos.abonos && datos.abonos.trim() !== '' ? parseFloat(datos.abonos) : 0,
        saldo: datos.saldo && datos.saldo.trim() !== '' ? parseFloat(datos.saldo) : 0,
        periodo: datos.periodo && datos.periodo.trim() !== '' ? datos.periodo : 'Descon'
      };

      if (registro.periodo && registro.periodo !== 'Descon') {
        const existePeriodo = await ExtractoBancario.findOne({ where: { periodo: registro.periodo } });
        if (existePeriodo) {
          throw new Error(`Ya existe un extracto bancario con el periodo ${registro.periodo}.`);
        }
      }

      return await ExtractoBancario.create(registro);
    }
  }

  // Actualizar un extracto existente
  async actualizarExtracto(id, datos) {
    const extracto = await ExtractoBancario.findByPk(id);
    if (!extracto) return null;
    return await extracto.update(datos);
  }

  // Eliminar un extracto
  async eliminarExtracto(id) {
    const extracto = await ExtractoBancario.findByPk(id);
    if (!extracto) return null;
    await extracto.destroy();
    return extracto;
  }

  //Subir y procesar archivo CSV
  async subirExtracto(archivoPath) {
    return new Promise((resolve, reject) => {
      const resultados = [];
  
      fs.createReadStream(archivoPath)
        .pipe(csv({ headers: true, skipLines: 1 })) // Asegura que ignora la primera línea si es encabezado
        .on('data', (fila) => {

          console.log('Fila procesada:', fila); // Verifica los datos de cada fila
          try {
            const fecha = moment(fila.Fecha, "DD/MM/YYYY", true).isValid() 
              ? moment(fila.Fecha, "DD/MM/YYYY").format("YYYY-MM-DD") 
              : null;
  
            resultados.push({
              fecha: fecha,
              concepto: fila.Concepto?.trim() || 'Sin concepto',
              cargos: fila.Cargos && fila.Cargos.trim() !== '' ? parseFloat(fila.Cargos.replace(',', '')) : 0,
              abonos: fila.Abonos && fila.Abonos.trim() !== '' ? parseFloat(fila.Abonos.replace(',', '')) : 0,
              saldo: fila.Saldo && fila.Saldo.trim() !== '' ? parseFloat(fila.Saldo.replace(',', '')) : 0,
              periodo: fila.Periodo?.trim() || 'Desconocido'
            });
          } catch (error) {
            console.error(`Error al procesar fila:`, fila, error);
          }
        })
        .on('end', async () => {
          try {
            if (resultados.length === 0) {
              return reject(new Error('El archivo CSV no contiene datos válidos.'));
            }
            console.log('Fin del procesamiento del archivo');
            await ExtractoBancario.bulkCreate(resultados);
            resolve(`Se han guardado ${resultados.length} registros en la base de datos.`);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  
}

export default new ExtractoBancarioService();
