import { useState } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useCotizaciones } from "../../shared/hooks/useCotizaciones";
import "./ClienteCotizaciones.css";

import { PDFDownloadLink } from "@react-pdf/renderer";
import CotizacionPDF from "./CotizacionPDF";

const ClienteCotizaciones = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { cotizaciones, loading } = useCotizaciones();

    const [expandedCotizaciones, setExpandedCotizaciones] = useState({});
    const [vendedoresNombres, setVendedoresNombres] = useState({});
    const [clientesDatos, setClientesDatos] = useState({});
    const [pdfActivoPorCotizacion, setPdfActivoPorCotizacion] = useState({});

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleExpand = (id) => {
        setExpandedCotizaciones((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleVendedorChange = (id, nombre) => {
        setVendedoresNombres((prev) => ({
            ...prev,
            [id]: nombre,
        }));
    };

    const handleClienteChange = (id, field, value) => {
        setClientesDatos((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const generarPDF = (id) => {
        setPdfActivoPorCotizacion((prev) => ({
            ...prev,
            [id]: true,
        }));
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="clt-main">
                <h1 className="clt-title">Mis Cotizaciones</h1>

                {loading ? (
                    <p className="clt-message">Cargando cotizaciones...</p>
                ) : cotizaciones.length === 0 ? (
                    <p className="clt-message">No hay cotizaciones disponibles.</p>
                ) : (
                    <ul className="clt-cotizaciones-list">
                        {cotizaciones.map((cotizacion) => {
                            const id = cotizacion._id;
                            const isExpanded = expandedCotizaciones[id] || false;
                            const productosMostrar = isExpanded
                                ? cotizacion.productos
                                : cotizacion.productos.slice(0, 2);

                            const clienteManual = clientesDatos[id] || {};

                            return (
                                <li key={id} className="clt-cotizacion">
                                    <div className="clt-cotizacion-header">
                                        <span>
                                            <strong>Vendedor:</strong>{" "}
                                            {clienteManual.nombre
                                                ? clienteManual.nombre
                                                : `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellido}`}
                                        </span>
                                        <span>
                                            <strong>Correo:</strong>{" "}
                                            {clienteManual.correo || cotizacion.cliente.correo}
                                        </span>
                                        <span>
                                            <strong>Fecha:</strong>{" "}
                                            {new Date(cotizacion.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <ul className="clt-productos-list">
                                        {productosMostrar.map(({ producto, cantidad }) => (
                                            <li key={producto._id} className="clt-producto-item">
                                                {producto.imagen && (
                                                    <img
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        className="clt-producto-img"
                                                        loading="lazy"
                                                    />
                                                )}
                                                <div className="clt-producto-info">
                                                    <span className="clt-producto-nombre">
                                                        {producto.nombre}
                                                    </span>
                                                    <span>x {cantidad}</span>
                                                    <span className="clt-producto-subtotal">
                                                        Q{producto.precio * cantidad}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}

                                        {cotizacion.productos.length > 2 && (
                                            <li>
                                                <button
                                                    className="clt-toggle-desc-btn"
                                                    onClick={() => toggleExpand(id)}
                                                >
                                                    {isExpanded ? "Ver menos" : "Ver más"}
                                                </button>
                                            </li>
                                        )}
                                    </ul>

                                    <div className="clt-total">
                                        <strong>Total:</strong>{" "}
                                        Q
                                        {cotizacion.productos.reduce(
                                            (acc, { producto, cantidad }) =>
                                                acc + producto.precio * cantidad,
                                            0
                                        )}
                                    </div>

                                    <div className="clt-vendedor-container">
                                        <label className="clt-vendedor-label">Nombre del cliente:</label>
                                        <input
                                            type="text"
                                            placeholder="Coloque el nombre del cliente"
                                            value={clienteManual.nombre || ""}
                                            onChange={(e) =>
                                                handleClienteChange(id, "nombre", e.target.value)
                                            }
                                            className="clt-vendedor-input"
                                        />

                                        <label className="clt-vendedor-label">NIT:</label>
                                        <input
                                            type="text"
                                            placeholder="Coloque el NIT del cliente"
                                            value={clienteManual.nit || ""}
                                            onChange={(e) =>
                                                handleClienteChange(id, "nit", e.target.value)
                                            }
                                            className="clt-vendedor-input"
                                        />

                                        <label className="clt-vendedor-label">Correo:</label>
                                        <input
                                            type="email"
                                            placeholder="Coloque el correo del cliente"
                                            value={clienteManual.correo || ""}
                                            onChange={(e) =>
                                                handleClienteChange(id, "correo", e.target.value)
                                            }
                                            className="clt-vendedor-input"
                                        />

                                        <label className="clt-vendedor-label">Teléfono:</label>
                                        <input
                                            type="text"
                                            placeholder="Coloque el teléfono del cliente"
                                            value={clienteManual.telefono || ""}
                                            onChange={(e) =>
                                                handleClienteChange(id, "telefono", e.target.value)
                                            }
                                            className="clt-vendedor-input"
                                        />
                                    </div>

                                    <div className="clt-vendedor-container">
                                        <label className="clt-vendedor-label">Nombre del vendedor:</label>
                                        <input
                                            type="text"
                                            placeholder="Coloque el nombre del vendedor"
                                            value={vendedoresNombres[id] || ""}
                                            onChange={(e) =>
                                                handleVendedorChange(id, e.target.value)
                                            }
                                            className="clt-vendedor-input"
                                        />
                                    </div>

                                    <div style={{ marginTop: "10px", textAlign: "right" }}>
                                        {!pdfActivoPorCotizacion[id] && (
                                            <button
                                                className="clt-pdf-btn"
                                                onClick={() => generarPDF(id)}
                                            >
                                                Generar PDF
                                            </button>
                                        )}

                                        {pdfActivoPorCotizacion[id] && (
                                            <PDFDownloadLink
                                                document={
                                                    <CotizacionPDF
                                                        cotizacion={cotizacion}
                                                        vendedorNombre={vendedoresNombres[id]}
                                                        clienteInfo={clienteManual}
                                                    />
                                                }
                                                fileName={`Cotización de ${clienteManual.nombre || "cliente"}.pdf`}
                                            >
                                                {({ loading }) =>
                                                    loading
                                                        ? "Generando PDF..."
                                                        : "Descargar PDF"
                                                }
                                            </PDFDownloadLink>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default ClienteCotizaciones;
