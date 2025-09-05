import { useState } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useCotizaciones } from "../../shared/hooks/useCotizaciones";
import "./ClienteCotizaciones.css";

import { PDFDownloadLink } from '@react-pdf/renderer';
import CotizacionPDF from './CotizacionPDF';

const ClienteCotizaciones = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { cotizaciones, loading } = useCotizaciones();

    const [expandedCotizaciones, setExpandedCotizaciones] = useState({});

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleExpand = (id) => {
        setExpandedCotizaciones((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const getEstadoClass = (estado) => {
        switch (estado) {
            case "CONFIRMADA":
                return "clt-estado confirmada";
            case "PENDIENTE":
                return "clt-estado pendiente";
            case "CANCELADA":
                return "clt-estado cancelada";
            default:
                return "clt-estado";
        }
    }

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
                            const isExpanded = expandedCotizaciones[cotizacion._id] || false;
                            const productosMostrar = isExpanded
                                ? cotizacion.productos
                                : cotizacion.productos.slice(0, 2);

                            return (
                                <li key={cotizacion._id} className="clt-cotizacion">
                                    <div className="clt-cotizacion-header">
                                        <span>
                                            <strong>Cliente:</strong> {cotizacion.cliente.nombre}{" "}
                                            {cotizacion.cliente.apellido}
                                        </span>
                                        <span>
                                            <strong>Correo:</strong> {cotizacion.cliente.correo}
                                        </span>
                                        <span>
                                            <strong>Fecha:</strong>{" "}
                                            {new Date(cotizacion.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className={getEstadoClass(cotizacion.estado)}>
                                            {cotizacion.estado}
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
                                                    />
                                                )}
                                                <div className="clt-producto-info">
                                                    <span className="clt-producto-nombre">{producto.nombre}</span>
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
                                                    onClick={() => toggleExpand(cotizacion._id)}
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

                                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                        <PDFDownloadLink
                                            document={<CotizacionPDF cotizacion={cotizacion} />}
                                            fileName={`cotizacion-${cotizacion._id}.pdf`}
                                        >
                                            {({ blob, url, loading, error }) =>
                                                loading ? 'Generando PDF...' : 'Descargar PDF'
                                            }
                                        </PDFDownloadLink>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    )
}

export default ClienteCotizaciones;
