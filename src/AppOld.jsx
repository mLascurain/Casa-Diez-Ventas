import "./App.css";
import { useState } from "react";
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
  tonicoFacial: 6000,
  serumPuntas: 6500,
};

const categorias = {
  brumas: ["Bruma Armonizacion", "Bruma Concentracion", "Bruma Meditacion"],
  rollons: ["Rollon Bienestar", "Rollon Calma", "Rollon Energia"],
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
  return 0; // Si el producto no está en la lista, devuelve 0
};

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [editData, setEditData] = useState(null);

  const handleNuevaVenta = (data) => {
    // Calcular el monto total de la venta
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
    const email = "kiwino237@gmail.com"; // Reemplaza con el correo destinatario

    // Obtener la fecha actual
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, "0");
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    // Construir el cuerpo del correo
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

    const subject = `Ventas Realizadas - ${fechaFormateada}`;

    return `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;
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
            <div
              key={index}
              className="venta-card"
              onClick={() => handleEditarVenta(venta, index)}
            >
              <p>Nombre: {venta.nombre}</p>
              <p>Tipo de pago: {venta.tipoPago}</p>
              <p>Total: ${venta.total}</p>
              <p>Entregado: {venta.entregado ? "Sí" : "No"}</p>
              <p>Tipo de venta: {venta.tipoVenta}</p>
              {venta.tipoVenta === "reventa" && (
                <p>Tipo de reventa: {venta.tipoReventa}</p>
              )}
            </div>
          ))}
        </div>
        {ventas.length > 0 && (
          <a href={generateEmailLink()} className="enviar-ventas">
            <button>Enviar ventas por correo</button>
          </a>
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
    </div>
  );
}

export default App;
