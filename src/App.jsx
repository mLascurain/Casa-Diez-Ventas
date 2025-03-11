import "./App.css";
import { useState, useEffect } from "react";
import Modal from "./components/Modal/Modal";
import Formulario from "./components/Formulario/Formulario";
import Logo from "./assets/Logo.png";

// Lista de precios y categorías
const precios = {
  brumas: 7200,
  rollons: 7600,
  tisanas: 5800,
  protectorSolar: 7500,
  repelenteInsectos: 6600,
  tonicoFacial: 5500,
  serumPuntas: 6500,
};

const categorias = {
  brumas: ["Bruma Armonizacion", "Bruma Concentracion", "Bruma Meditacion"],
  rollons: ["Roll on Bienestar", "Roll on Calma", "Roll on Energia"],
  tisanas: ["Tisana Luna", "Tisana Sol"],
  protectorSolar: ["Protector Solar"],
  repelenteInsectos: ["Repelente de Insectos"],
  tonicoFacial: ["Tonico Facial"],
  serumPuntas: ["Serum para puntas"],
};

const obtenerPrecioProducto = (nombreProducto) => {
  for (const [categoria, productos] of Object.entries(categorias)) {
    if (productos.includes(nombreProducto)) {
      return precios[categoria] || 0;
    }
  }
  return 0;
};

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [ventas, setVentas] = useState(() => {
    const savedVentas = localStorage.getItem("ventas");
    return savedVentas ? JSON.parse(savedVentas) : [];
  });
  const [editData, setEditData] = useState(null);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Sincroniza las ventas con Local Storage
  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  const handleNuevaVenta = (data) => {
    const total = data.productos.reduce((acc, producto) => {
      return acc + obtenerPrecioProducto(producto.nombre) * producto.cantidad;
    }, 0);

    const ventaConTotal = { ...data, total };

    if (editData) {
      setVentas(
        ventas.map((venta, index) =>
          index === editData.index ? ventaConTotal : venta
        )
      );
      setEditData(null);
    } else {
      setVentas([...ventas, ventaConTotal]);
    }
    setModalOpen(false);
  };

  const handleEditarVenta = (venta, index) => {
    setEditData({ ...venta, index });
    setModalOpen(true);
  };

  const generateEmailLink = () => {
    const email = import.meta.env.VITE_EMAIL;
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, "0");
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    let emailBody = ventas
      .map(
        (venta, index) =>
          `VENTA-N-${index + 1}\n` +
          `Nombre: ${venta.nombre}\n` +
          `Productos:\n` +
          venta.productos
            .map(
              (producto) =>
                `  - ${producto.nombre} x${
                  producto.cantidad
                } (${obtenerPrecioProducto(producto.nombre)} c/u)`
            )
            .join("\n") +
          `\nTotal: $${venta.total}\n` +
          `Tipo de pago: ${venta.tipoPago}\n` +
          (venta.tipoPago === "mp"
            ? `Comprobante: ${
                venta.comprobante ? "Chequeado" : "No chequeado"
              }\n`
            : "") +
          `Entregado: ${venta.entregado ? "Sí" : "No"}\n` +
          `Tipo de venta: ${venta.tipoVenta}\n` +
          (venta.tipoVenta === "reventa"
            ? `Tipo de reventa: ${venta.tipoReventa}\n`
            : "") +
          `Observaciones: ${venta.observaciones || "Ninguna"}\n\n` +
          `====================================================================\n\n`
      )
      .join("");

    const subject = `[Casa Diez] Ventas Realizadas - ${fechaFormateada}`;

    return `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleSendEmail = () => {
    if (password === import.meta.env.VITE_PASSWORD) {
      window.location.href = generateEmailLink();
      setVentas([]);
      localStorage.removeItem("ventas");
      setPasswordModalOpen(false);
    } else {
      setErrorMessage("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  const handleEliminarVenta = (index) => {
    setVentas(ventas.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <header>
        <img className="logo" src={Logo} alt="Logo de Casa Diez" />
      </header>
      <button className="nueva-venta" onClick={() => setModalOpen(true)}>
        + Agregar una nueva venta
      </button>
      <div className="ventas-container">
        <div className="ventas">
          {ventas.map((venta, index) => (
            <div key={index} className="venta-card">
              <p>Nombre: {venta.nombre}</p>
              <p>Tipo de pago: {venta.tipoPago}</p>
              <p>Total: ${venta.total}</p>
              <p>Entregado: {venta.entregado ? "Sí" : "No"}</p>
              <p>Tipo de venta: {venta.tipoVenta}</p>
              {venta.tipoVenta === "reventa" && (
                <p>Tipo de reventa: {venta.tipoReventa}</p>
              )}
              <div className="venta-card-actions">
                <button onClick={() => handleEditarVenta(venta, index)}>
                  Editar venta
                </button>
                <button onClick={() => handleEliminarVenta(index)}>
                  Eliminar venta
                </button>
              </div>
            </div>
          ))}
        </div>
        {ventas.length > 0 && (
          <button
            className="enviar-ventas"
            onClick={() => setPasswordModalOpen(true)}
          >
            Enviar ventas por correo
          </button>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <Formulario
          onSubmit={handleNuevaVenta}
          initialData={editData || {}}
          onCancel={() => {
            setModalOpen(false);
            setEditData(null);
          }}
        />
      </Modal>
      {isPasswordModalOpen && (
        <Modal isOpen={true} onClose={() => setPasswordModalOpen(false)}>
          <h2>Confirmar contraseña</h2>
          <input
            type="password"
            placeholder="Introduci la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <div className="password-actions">
            <button onClick={handleSendEmail}>Confirmar</button>
            <button onClick={() => setPasswordModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
