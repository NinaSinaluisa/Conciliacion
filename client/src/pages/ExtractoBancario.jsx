import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/ExtractoBancario.css';
import Papa from 'papaparse';


const ExtractoBancario = () => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [extractos, setExtractos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [extractoEditado, setExtractoEditado] = useState(null);

  useEffect(() => {
    const obtenerExtractos = async () => {
      try {
        const response = await axios.get('/extractos');
        setExtractos(response.data);
      } catch (err) {
        console.error('Error al obtener extractos:', err);
      }
    };
    obtenerExtractos();
  }, []);

  const handleArchivoChange = (e) => {
    const archivoSeleccionado = e.target.files[0];
    if (archivoSeleccionado) {
      setArchivo(archivoSeleccionado);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!archivo) {
      setError('Por favor, selecciona un archivo.');
      return;
    }
  
    const formData = new FormData();
    formData.append('archivo', archivo);
  
    try {
      setMensaje('');
      setError('');
  
      // Leer y procesar el archivo CSV
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result;
        const lines = fileContent.split('\n');
  
        // Obtener el periodo del encabezado (línea 1)
        const periodoLine = lines[0].trim(); // "Periodo: 2025-02"
        const periodo = periodoLine.includes('Periodo:') ? periodoLine.split(':')[1].trim() : null;
  
        // Asegurarse de que el periodo se obtuvo correctamente
        if (!periodo) {
          setError('El archivo no contiene un periodo válido.');
          return;
        }
  
        // Procesar las líneas de los extractos (empezar desde la segunda línea)
        const extractosDatos = lines.slice(2).map((line) => {
          // Ignorar líneas vacías o mal formateadas
          if (!line.trim()) return null;
  
          // Separar los campos por comas
          const [fecha, concepto, cargos, abonos] = line.split(',');
  
          // Validar que todos los campos estén presentes antes de procesarlos
          if (!fecha || !concepto || (cargos === undefined && abonos === undefined)) {
            return null; // Ignorar registros incompletos
          }
  
          // Retornar el objeto con los datos procesados
          return {
            fecha: fecha.trim(),
            concepto: concepto.trim(),
            cargos: cargos ? cargos.trim() : '',
            abonos: abonos ? abonos.trim() : '',
            periodo: periodo,
          };
        }).filter(item => item !== null); // Eliminar los elementos nulos
  
        // Verificar que se procesaron datos correctamente
        if (extractosDatos.length === 0) {
          setError('No se encontraron datos válidos en el archivo.');
          return;
        }
  
        // Enviar los datos al backend
        const response = await axios.post('http://localhost:4000/extractos', {
          datos: extractosDatos,
        });
  
        setMensaje(response.data.message);
  
        const newExtractos = await axios.get('http://localhost:4000/extractos');
        setExtractos(newExtractos.data);
      };
  
      reader.onerror = (err) => {
        setError('Error al leer el archivo');
      };
  
      reader.readAsText(archivo);
  
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir el archivo.');
    }
  };
  
  
  const handleEdit = (extracto) => {
    setExtractoEditado(extracto);
    setEditando(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/extractos/${id}`);
      setMensaje('Extracto eliminado exitosamente');
      // Recargar los extractos después de eliminar
      const newExtractos = await axios.get('/extractos');
      setExtractos(newExtractos.data);
    } catch (err) {
      setError('Error al eliminar el extracto.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!extractoEditado) return;

    try {
      await axios.put(`/extractos/${extractoEditado.id}`, extractoEditado);
      setMensaje('Extracto actualizado exitosamente');
      setEditando(false);
      // Recargar los extractos después de editar
      const newExtractos = await axios.get('/extractos');
      setExtractos(newExtractos.data);
    } catch (err) {
      setError('Error al actualizar el extracto.');
    }
  };

  return (
    <div>
      <h2>Cargar Extracto Bancario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="archivo">Selecciona un archivo CSV:</label>
          <input
            type="file"
            id="archivo"
            name="archivo"
            accept=".csv, .txt, .log"
            onChange={handleArchivoChange}
          />
        </div>
        <button type="submit">Subir Extracto</button>
      </form>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Extractos Bancarios</h3>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Cargos</th>
            <th>Abonos</th>
            <th>Saldo</th>
            <th>Periodo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {extractos.map((extracto) => (
            <tr key={extracto.id}>
              <td>{extracto.fecha}</td>
              <td>{extracto.concepto}</td>
              <td>{extracto.cargos}</td>
              <td>{extracto.abonos}</td>
              <td>{extracto.saldo}</td>
              <td>{extracto.periodo}</td>
              <td>
                <button onClick={() => handleEdit(extracto)}>Editar</button>
                <button onClick={() => handleDelete(extracto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && extractoEditado && (
        <div>
          <h3>Editar Extracto</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Fecha:</label>
              <input
                type="date"
                value={extractoEditado.fecha}
                onChange={(e) => setExtractoEditado({ ...extractoEditado, fecha: e.target.value })}
              />
            </div>
            <div>
              <label>Concepto:</label>
              <input
                type="text"
                value={extractoEditado.concepto}
                onChange={(e) => setExtractoEditado({ ...extractoEditado, concepto: e.target.value })}
              />
            </div>
            <div>
              <label>Cargos:</label>
              <input
                type="number"
                value={extractoEditado.cargos}
                onChange={(e) => setExtractoEditado({ ...extractoEditado, cargos: e.target.value })}
              />
            </div>
            <div>
              <label>Abonos:</label>
              <input
                type="number"
                value={extractoEditado.abonos}
                onChange={(e) => setExtractoEditado({ ...extractoEditado, abonos: e.target.value })}
              />
            </div>
            <div>
              <label>Saldo:</label>
              <input
                type="number"
                value={extractoEditado.saldo}
                onChange={(e) => setExtractoEditado({ ...extractoEditado, saldo: e.target.value })}
              />
            </div>
            <div>
              <label>Periodo:</label>
              <input
                type="text"
                value={extractoEditado.periodo}
                onChange={(e) => setExtractoEditado({ ...extractoEditado, periodo: e.target.value })}
              />
            </div>
            <button type="submit">Actualizar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExtractoBancario;
