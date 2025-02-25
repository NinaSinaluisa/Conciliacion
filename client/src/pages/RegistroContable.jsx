import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/RegistroContable.css';
import Papa from 'papaparse';

const RegistroContable = () => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(false);
  const [registroEditado, setRegistroEditado] = useState(null);

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        const response = await axios.get('/registros');
        setRegistros(response.data);
      } catch (err) {
        console.error('Error al obtener registros:', err);
      }
    };
    obtenerRegistros();
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
        const periodoLine = lines[0].trim(); // "periodo: 2025-02"
        const periodo = periodoLine.includes('periodo:') ? periodoLine.split(':')[1].trim() : null;
  
        // Asegurarse de que el periodo se obtuvo correctamente
        if (!periodo) {
          setError('El archivo no contiene un periodo válido.');
          return;
        }
  
        // Procesar las líneas de los registros (empezar desde la tercera línea)
        const registrosDatos = lines.slice(2).map((line) => {
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
        if (registrosDatos.length === 0) {
          setError('No se encontraron datos válidos en el archivo.');
          return;
        }
  
        // Verificar los datos antes de enviarlos
        console.log('Datos a enviar:', registrosDatos);
  
        // Enviar los datos al backend
        const response = await axios.post('http://localhost:4000/registros', registrosDatos, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        setMensaje(response.data.message);
  
        // Obtener los registros actualizados
        const newRegistros = await axios.get('http://localhost:4000/registros');
        setRegistros(newRegistros.data);
      };
  
      reader.onerror = (err) => {
        setError('Error al leer el archivo');
      };
  
      reader.readAsText(archivo);
  
    } catch (err) {
      console.error(err); // Agregar más detalles de error
      setError(err.response?.data?.message || 'Error al subir el archivo.');
    }
  };
  

  
  const handleEdit = (registro) => {
    setRegistroEditado(registro);
    setEditando(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/registros/${id}`);
      setMensaje('Registro eliminado exitosamente');
      // Recargar los registros después de eliminar
      const newRegistros = await axios.get('/registros');
      setRegistros(newRegistros.data);
    } catch (err) {
      setError('Error al eliminar el registro.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!registroEditado) return;

    try {
      await axios.put(`/registros/${registroEditado.id}`, registroEditado);
      setMensaje('Registro actualizado exitosamente');
      setEditando(false);
      // Recargar los registros después de editar
      const newRegistros = await axios.get('/registros');
      setRegistros(newRegistros.data);
    } catch (err) {
      setError('Error al actualizar el registro.');
    }
  };

  return (
    <div>
      <h2>Cargar Registro Contable</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="archivo">Selecciona un archivo CSV:</label>
          <input
            type="file"
            id="archivo"
            name="archivo"
            accept=".csv"
            onChange={handleArchivoChange}
          />
        </div>
        <button type="submit">Subir Registro</button>
      </form>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
<div className="conciliaciones-panel1">
      <h3>Registros Contables</h3>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Cargos</th>
            <th>Abonos</th>
            <th>Periodo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.fecha}</td>
              <td>{registro.concepto}</td>
              <td>{registro.cargos}</td>
              <td>{registro.abonos}</td>
              <td>{registro.periodo}</td>
              <td>
                <button onClick={() => handleEdit(registro)}>Editar</button>
                <button onClick={() => handleDelete(registro.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {editando && registroEditado && (
        <div>
          <h3>Editar Registro</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Fecha:</label>
              <input
                type="date"
                value={registroEditado.fecha}
                onChange={(e) => setRegistroEditado({ ...registroEditado, fecha: e.target.value })}
              />
            </div>
            <div>
              <label>Concepto:</label>
              <input
                type="text"
                value={registroEditado.concepto}
                onChange={(e) => setRegistroEditado({ ...registroEditado, concepto: e.target.value })}
              />
            </div>
            <div>
              <label>Cargos:</label>
              <input
                type="number"
                value={registroEditado.cargos}
                onChange={(e) => setRegistroEditado({ ...registroEditado, cargos: e.target.value })}
              />
            </div>
            <div>
              <label>Abonos:</label>
              <input
                type="number"
                value={registroEditado.abonos}
                onChange={(e) => setRegistroEditado({ ...registroEditado, abonos: e.target.value })}
              />
            </div>
            <div>
              <label>Periodo:</label>
              <input
                type="text"
                value={registroEditado.periodo}
                onChange={(e) => setRegistroEditado({ ...registroEditado, periodo: e.target.value })}
              />
            </div>
            <button type="submit">Actualizar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistroContable;
