/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Formulario.css";

const Formulario = ({ onSubmit, initialData = {}, onCancel }) => {
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [tipoPago, setTipoPago] = useState(initialData.tipoPago || "");
  const [entregado, setEntregado] = useState(initialData.entregado || false);
  const [comprobante, setComprobante] = useState(
    initialData.comprobante || false
  );
  const [tipoVenta, setTipoVenta] = useState(initialData.tipoVenta || "");
  const [tipoReventa, setTipoReventa] = useState(initialData.tipoReventa || "");
  const [observaciones, setObservaciones] = useState(
    initialData.observaciones || ""
  );
  const [productosSeleccionados, setProductosSeleccionados] = useState(
    initialData.productos || []
  );
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");

  const productos = [
    "Bruma Armonizacion",
    "Bruma Concentracion",
    "Bruma Meditacion",
    "Rollon Bienestar",
    "Rollon Calma",
    "Rollon Energia",
    "Tisana Luna",
    "Tisana Sol",
    "Protector Solar",
    "Repelente de Insectos",
    "Tonico Facial",
    "Serum para puntas",
  ];

  const agregarProducto = () => {
    if (producto && cantidad > 0) {
      setProductosSeleccionados([
        ...productosSeleccionados,
        { nombre: producto, cantidad: parseInt(cantidad) },
      ]);
      setProducto("");
      setCantidad("");
    }
  };

  const eliminarProducto = (index) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nombre,
      tipoPago,
      entregado,
      comprobante: tipoPago === "mp" ? comprobante : null, // Comprobante solo para MP
      tipoVenta,
      tipoReventa: tipoVenta === "reventa" ? tipoReventa : null,
      observaciones,
      productos: productosSeleccionados,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar Nueva Venta</h3>

      {/* Nombre */}
      <div>
        <label htmlFor="nombre">Nombre del cliente (opcional):</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      {/* Selección de productos */}
      <div>
        <label htmlFor="producto">Producto:</label>
        <select
          id="producto"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
        >
          <option value="" disabled>
            Seleccione un producto
          </option>
          {productos.map((p, index) => (
            <option key={index} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min="1"
        />
      </div>
      <button type="button" onClick={agregarProducto}>
        Agregar producto
      </button>
      <ul>
        {productosSeleccionados.map((p, index) => (
          <li key={index}>
            {p.nombre} - {p.cantidad}{" "}
            <button type="button" onClick={() => eliminarProducto(index)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Tipo de Pago */}
      <div>
        <label>Tipo de pago:</label>
        <select value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
          <option value="" disabled>
            Seleccione el tipo de pago
          </option>
          <option value="mp">Mercado Pago</option>
          <option value="efectivo">Efectivo</option>
        </select>
      </div>

      {/* Comprobante (visible solo si es Mercado Pago) */}
      {tipoPago === "mp" && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={comprobante}
              onChange={(e) => setComprobante(e.target.checked)}
            />
            Comprobante chequeado
          </label>
        </div>
      )}

      {/* Entregado */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={entregado}
            onChange={(e) => setEntregado(e.target.checked)}
          />
          Entregado
        </label>
      </div>

      {/* Tipo de Venta */}
      <div>
        <label>Tipo de venta:</label>
        <select
          value={tipoVenta}
          onChange={(e) => setTipoVenta(e.target.value)}
        >
          <option value="" disabled>
            Seleccione el tipo de venta
          </option>
          <option value="feria">Feria</option>
          <option value="particular">Particular</option>
          <option value="reventa">Reventa</option>
        </select>
      </div>

      {/* Tipo de Reventa (visible solo si es reventa) */}
      {tipoVenta === "reventa" && (
        <div>
          <label>Tipo de reventa:</label>
          <select
            value={tipoReventa}
            onChange={(e) => setTipoReventa(e.target.value)}
          >
            <option value="" disabled>
              Seleccione el tipo de reventa
            </option>
            <option value="consignacion">Consignación</option>
            <option value="compra">Compra</option>
          </select>
        </div>
      )}

      {/* Observaciones */}
      <div>
        <label htmlFor="observaciones">Observaciones (opcional):</label>
        <textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>

      <button type="submit">Guardar Venta</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default Formulario;
