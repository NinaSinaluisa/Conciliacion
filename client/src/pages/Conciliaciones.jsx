import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { format } from "date-fns";
import '../utils/Conciliaciones.css';

registerLocale("es", es);

const Conciliaciones = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [conciliacion, setConciliacion] = useState(null);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSaveMessage(null);

    const periodo = format(selectedDate, "yyyy-MM");

    try {
      const response = await fetch("http://localhost:4000/conciliacion/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodo }),
      });

      if (!response.ok) throw new Error("Error al generar la conciliación");

      const data = await response.json();
      setConciliacion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!conciliacion) return;

    setSaving(true);
    setError(null);
    setSaveMessage(null);
    console.log("Conciliación generada:", conciliacion);
    try {
      const response = await fetch("http://localhost:4000/conciliacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conciliacion),
      });

      if (!response.ok) throw new Error("Error al guardar la conciliación, ya existe un registro para el periodo");

      setSaveMessage("Conciliación guardada correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", textAlign: "center", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Generar Conciliación</h2>
      
      <label style={{ display: "block", marginBottom: "10px" }}>Seleccione el periodo:</label>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="yyyy-MM"
        showMonthYearPicker
        locale="es"
        className="datepicker"
      />
      
      <button 
        onClick={handleGenerate} 
        disabled={loading} 
        style={{ display: "inline-block", margin: "20px 10px", padding: "10px 20px", cursor: "pointer" }}>
        {loading ? "Generando..." : "Generar Conciliación"}
      </button>

      {conciliacion && (
        <button 
          onClick={handleSave} 
          disabled={saving} 
          style={{ display: "inline-block", margin: "20px 10px", padding: "10px 20px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white" }}>
          {saving ? "Guardando..." : "Guardar Conciliación"}
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {saveMessage && <p style={{ color: "green" }}>{saveMessage}</p>}

      {conciliacion && (
        <div className="conciliaciones-panel1" style={{ textAlign: "left", marginTop: "20px" }}>
          <h3>Resultado de la Conciliación</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Periodo</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Saldo según bancos</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Saldo según libros</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{conciliacion.periodo}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>${conciliacion.saldoSegunBancos}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>${conciliacion.saldoSegunLibros}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>${conciliacion.diferencia}</td>
              </tr>
            </tbody>
          </table>

          <h4>Cargos del banco no registrados por la empresa</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Concepto</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {conciliacion.cargosBancoNoEmpresa.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.fecha}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.concepto}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>${item.importe}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Cargos de la empresa no registrados por el banco</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Concepto</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {conciliacion.cargosEmpresaNoBanco.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.fecha}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.concepto}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>${item.importe}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Abonos del banco no registrados por la empresa</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Concepto</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {conciliacion.abonosBancoNoEmpresa.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.fecha}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.concepto}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>${item.importe}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Abonos de la empresa no registrados por el banco</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Concepto</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {conciliacion.abonosEmpresaNoBanco.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.fecha}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.concepto}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>${item.importe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Conciliaciones;