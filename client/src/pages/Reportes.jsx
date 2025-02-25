import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/Reporte.css';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const API_URL_CONCILIACION = 'http://localhost:4000/conciliacion'; // Cambia la URL si es necesario

const ReporteConciliaciones = () => {
  const [conciliaciones, setConciliaciones] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de confirmación de eliminación
  const [conciliacionEdit, setConciliacionEdit] = useState(null); // Estado para los datos de la conciliación a editar
  const [conciliacionToDelete, setConciliacionToDelete] = useState(null); // Estado para la conciliación a eliminar

  useEffect(() => {
    // Obtener las conciliaciones cuando el componente se monte
    const obtenerConciliaciones = async () => {
      try {
        const response = await axios.get(API_URL_CONCILIACION);
        setConciliaciones(response.data);
      } catch (error) {
        console.error('Error al obtener las conciliaciones:', error);
      }
    };

    obtenerConciliaciones();
  }, []);

  // Función para manejar la eliminación de una conciliación
  const eliminarConciliacion = async () => {
    try {
      await axios.delete(`${API_URL_CONCILIACION}/${conciliacionToDelete.id}`);
      setConciliaciones(conciliaciones.filter((conciliacion) => conciliacion.id !== conciliacionToDelete.id));
      setShowDeleteModal(false); // Cerrar el modal de eliminación
    } catch (error) {
      console.error('Error al eliminar la conciliación:', error);
    }
  };

  // Función para manejar la edición de una conciliación
  const editarConciliacion = (conciliacion) => {
    setConciliacionEdit(conciliacion); // Establecer los datos de la conciliación a editar
    setShowEditModal(true); // Mostrar el modal de edición
  };

  // Función para manejar el cambio de los campos del formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConciliacionEdit({
      ...conciliacionEdit,
      [name]: value,
    });
  };

  // Función para guardar la conciliación editada
  const guardarEdicion = async () => {
    try {
      await axios.put(`${API_URL_CONCILIACION}/${conciliacionEdit.id}`, conciliacionEdit);
      setConciliaciones(conciliaciones.map((item) => (item.id === conciliacionEdit.id ? conciliacionEdit : item)));
      setShowEditModal(false); // Cerrar el modal de edición
    } catch (error) {
      console.error('Error al guardar la conciliación editada:', error);
    }
  };

  // Función para generar y descargar el PDF
  const descargarPDF = (conciliacion) => {
    const doc = new jsPDF();
  
    // Título
    doc.setFontSize(18);
    doc.text(`Reporte de Conciliación: ${conciliacion.periodo}`, 10, 10);
  
    // Información general
    doc.setFontSize(12);
    doc.text(`Saldo Según Bancos: ${conciliacion.saldoSegunBancos}`, 10, 20);
    doc.text(`Saldo Según Libros: ${conciliacion.saldoSegunLibros}`, 10, 30);
    doc.text(`Diferencia: ${conciliacion.diferencia}`, 10, 40);
  
    // Agregar los cargos y abonos en el PDF como tablas
    const headers = [["Fecha", "Concepto", "Importe"]];
  
    // Cargos del Banco no Registrados por la Empresa
    doc.autoTable({
      startY: 50,
      head: headers,
      body: conciliacion.cargosBancoNoEmpresa.map(item => [item.fecha, item.concepto, item.importe]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10 },
    });
  
    // Cargos de la Empresa no Registrados por el Banco
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: headers,
      body: conciliacion.cargosEmpresaNoBanco.map(item => [item.fecha, item.concepto, item.importe]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10 },
    });
  
    // Abonos del Banco no Registrados por la Empresa
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: headers,
      body: conciliacion.abonosBancoNoEmpresa.map(item => [item.fecha, item.concepto, item.importe]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10 },
    });
  
    // Abonos de la Empresa no Registrados por el Banco
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: headers,
      body: conciliacion.abonosEmpresaNoBanco.map(item => [item.fecha, item.concepto, item.importe]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10 },
    });
  
    // Descargar el PDF
    doc.save(`Conciliacion_${conciliacion.periodo}.pdf`);
  };

  return (
    <div>
      <h2>Reporte de Conciliaciones</h2>
      <table>
        <thead>
          <tr>
            <th>Periodo</th>
            <th>Saldo Según Bancos</th>
            <th>Saldo Según Libros</th>
            <th>Diferencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conciliaciones.map((conciliacion) => (
            <tr key={conciliacion.id}>
              <td>{conciliacion.periodo}</td>
              <td>{conciliacion.saldoSegunBancos}</td>
              <td>{conciliacion.saldoSegunLibros}</td>
              <td>{conciliacion.diferencia}</td>
              <td>
                <button onClick={() => editarConciliacion(conciliacion)}>Editar</button>
                <button onClick={() => { setConciliacionToDelete(conciliacion); setShowDeleteModal(true); }}>
                  Eliminar
                  </button>
                <button onClick={() => descargarPDF(conciliacion)}>Descargar PDF</button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/* Modal de Edición */}
{showEditModal && conciliacionEdit && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
      <h3>Editar Conciliación</h3>
      <form className="edit-form">
        <div className="form-row">
          <div className="form-group">
            <label>Periodo:</label>
            <input
              type="text"
              name="periodo"
              value={conciliacionEdit.periodo}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Saldo Según Bancos:</label>
            <input
              type="number"
              name="saldoSegunBancos"
              value={conciliacionEdit.saldoSegunBancos}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Saldo Según Libros:</label>
            <input
              type="number"
              name="saldoSegunLibros"
              value={conciliacionEdit.saldoSegunLibros}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Diferencia:</label>
            <input
              type="number"
              name="diferencia"
              value={conciliacionEdit.diferencia}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Cargos del banco no registrados por la empresa */}
        <div>
          <h4>Cargos del Banco no Registrados por la Empresa</h4>
          {conciliacionEdit.cargosBancoNoEmpresa.map((item, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name={`cargosBancoNoEmpresa[${index}].fecha`}
                  value={item.fecha}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Concepto:</label>
                <input
                  type="text"
                  name={`cargosBancoNoEmpresa[${index}].concepto`}
                  value={item.concepto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Importe:</label>
                <input
                  type="number"
                  name={`cargosBancoNoEmpresa[${index}].importe`}
                  value={item.importe}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cargos de la empresa no registrados por el banco */}
        <div>
          <h4>Cargos de la Empresa no Registrados por el Banco</h4>
          {conciliacionEdit.cargosEmpresaNoBanco.map((item, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name={`cargosEmpresaNoBanco[${index}].fecha`}
                  value={item.fecha}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Concepto:</label>
                <input
                  type="text"
                  name={`cargosEmpresaNoBanco[${index}].concepto`}
                  value={item.concepto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Importe:</label>
                <input
                  type="number"
                  name={`cargosEmpresaNoBanco[${index}].importe`}
                  value={item.importe}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Abonos del banco no registrados por la empresa */}
        <div>
          <h4>Abonos del Banco no Registrados por la Empresa</h4>
          {conciliacionEdit.abonosBancoNoEmpresa.map((item, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name={`abonosBancoNoEmpresa[${index}].fecha`}
                  value={item.fecha}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Concepto:</label>
                <input
                  type="text"
                  name={`abonosBancoNoEmpresa[${index}].concepto`}
                  value={item.concepto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Importe:</label>
                <input
                  type="number"
                  name={`abonosBancoNoEmpresa[${index}].importe`}
                  value={item.importe}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Abonos de la empresa no registrados por el banco */}
        <div>
          <h4>Abonos de la Empresa no Registrados por el Banco</h4>
          {conciliacionEdit.abonosEmpresaNoBanco.map((item, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name={`abonosEmpresaNoBanco[${index}].fecha`}
                  value={item.fecha}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Concepto:</label>
                <input
                  type="text"
                  name={`abonosEmpresaNoBanco[${index}].concepto`}
                  value={item.concepto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Importe:</label>
                <input
                  type="number"
                  name={`abonosEmpresaNoBanco[${index}].importe`}
                  value={item.importe}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={guardarEdicion}>Guardar</button>
      </form>
    </div>
  </div>
)}


      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && conciliacionToDelete && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
            <h3>¿Estás seguro de que deseas eliminar esta conciliación?</h3>
            <button onClick={eliminarConciliacion}>Sí, Eliminar</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteConciliaciones;
