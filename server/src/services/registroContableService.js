import { RegistroContable } from '../models/RegistroContable.js';
import csv from 'csv-parser';
import fs from 'fs';
import moment from 'moment';

class RegistroContableService {
  async obtenerRegistros() {
    return await RegistroContable.findAll();
  }

  async obtenerRegistroPorId(id) {
    return await RegistroContable.findByPk(id);
  }

  async crearRegistro(datos) {
    // Verificar si 'datos' es un array
    if (Array.isArray(datos)) {
        const registrosProcesados = datos.map(registro => {
            const fechaParsed = moment(registro.fecha, "DD/MM/YYYY", true);
            return {
                fecha: fechaParsed.isValid() ? fechaParsed.toDate() : null,
                concepto: registro.concepto || '',
                cargos: registro.cargos && registro.cargos.trim() !== '' ? parseFloat(registro.cargos) : 0,
                abonos: registro.abonos && registro.abonos.trim() !== '' ? parseFloat(registro.abonos) : 0,
                periodo: registro.periodo || 'Marzo 2021' // Agregar el campo periodo
            };
        });
        return await RegistroContable.bulkCreate(registrosProcesados);
    } else {
        const fechaParsed = moment(datos.fecha, "DD/MM/YYYY", true);
        const registroProcesado = {
            fecha: fechaParsed.isValid() ? fechaParsed.toDate() : null,
            concepto: datos.concepto || '',
            cargos: datos.cargos && datos.cargos.trim() !== '' ? parseFloat(datos.cargos) : 0,
            abonos: datos.abonos && datos.abonos.trim() !== '' ? parseFloat(datos.abonos) : 0,
            periodo: datos.periodo || 'Marzo 2021' // Agregar el campo periodo
        };
        return await RegistroContable.create(registroProcesado);
    }
}


  async actualizarRegistro(id, datos) {
    const registro = await RegistroContable.findByPk(id);
    if (!registro) return null;
    return await registro.update(datos);
  }

  async eliminarRegistro(id) {
    const registro = await RegistroContable.findByPk(id);
    if (!registro) return null;
    await registro.destroy();
    return registro;
  }

  // Procesar CSV y guardar en la base de datos
  async procesarArchivoCSV(archivoPath) {
    return new Promise((resolve, reject) => {
      const resultados = [];
  
      fs.createReadStream(archivoPath)
        .pipe(csv({ headers: true, skipLines: 1 })) // Asegura que ignora encabezados
        .on('data', (fila) => {
          if (fila.Fecha?.toLowerCase().includes('total') || fila.Fecha?.toLowerCase().includes('saldo final')) {
            return; // Ignorar filas con totales o saldos finales
          }
  
          try {
            const fechaFormateada = moment(fila.Fecha, "DD/MM/YYYY", true).isValid() 
              ? moment(fila.Fecha, "DD/MM/YYYY").format("YYYY-MM-DD") 
              : null;
            const periodo = moment(fila.Fecha, "DD/MM/YYYY", true).isValid() 
              ? moment(fila.Fecha, "DD/MM/YYYY").format("YYYY-MM") 
              : 'Desconocido';
  
            resultados.push({
              fecha: fechaFormateada,
              concepto: fila.Concepto?.trim() || 'Sin concepto',
              cargos: fila['Cargos ($)'] && fila['Cargos ($)'].trim() !== '' 
                ? parseFloat(fila['Cargos ($)'].replace(',', '')) 
                : 0,
              abonos: fila['Abonos ($)'] && fila['Abonos ($)'].trim() !== '' 
                ? parseFloat(fila['Abonos ($)'].replace(',', '')) 
                : 0,
              periodo: periodo
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
            await RegistroContable.bulkCreate(resultados);
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

export default new RegistroContableService();
