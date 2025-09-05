import { useState } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useCotizaciones } from "../../shared/hooks/useCotizaciones";
import "./AdminCotizaciones.css";

import { PDFDownloadLink } from '@react-pdf/renderer';
import CotizacionPDF from './CotizacionPDF';

const AdminCotizaciones = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { cotizaciones, loading, handleActualizarEstadoCotizacion } = useCotizaciones();

    const [expandedCotizaciones, setExpandedCotizaciones] = useState({});

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleExpand = (id) => {
        setExpandedCotizaciones(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const getEstadoClass = (estado) => {
        switch (estado) {
            case "CONFIRMADA": return "admC-estado confirmada";
            case "PENDIENTE": return "admC-estado pendiente";
            case "CANCELADA": return "admC-estado cancelada";
            default: return "admC-estado";
        }
    }

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="admC-main">
                <h1 className="admC-title">Cotizaciones de Clientes</h1>

                {loading ? (
                    <p className="admC-message">Cargando cotizaciones...</p>
                ) : cotizaciones.length === 0 ? (
                    <p className="admC-message">No hay cotizaciones disponibles.</p>
                ) : (
                    <ul className="admC-cotizaciones-list">
                        {cotizaciones.map((cotizacion) => {
                            const isExpanded = expandedCotizaciones[cotizacion._id] || false;
                            const productosMostrar = isExpanded
                                ? cotizacion.productos
                                : cotizacion.productos.slice(0, 2);

                            return (
                                <li key={cotizacion._id} className="admC-cotizacion">
                                    <div className="admC-cotizacion-header">
                                        <span>
                                            <strong>Cliente:</strong> {cotizacion.cliente?.nombre || "-"} {cotizacion.cliente?.apellido || "-"}
                                        </span>
                                        <span>
                                            <strong>Correo:</strong> {cotizacion.cliente?.correo || "-"}
                                        </span>
                                        <span>
                                            <strong>Fecha:</strong> {new Date(cotizacion.createdAt).toLocaleDateString()}
                                        </span>

                                        <select
                                            className={getEstadoClass(cotizacion.estado)}
                                            value={cotizacion.estado}
                                            onChange={(e) =>
                                                handleActualizarEstadoCotizacion(cotizacion._id, e.target.value)
                                            }
                                        >
                                            <option value="PENDIENTE">Pendiente</option>
                                            <option value="CONFIRMADA">Confirmada</option>
                                            <option value="CANCELADA">Cancelada</option>
                                        </select>
                                    </div>

                                    <ul className="admC-productos-list">
                                        {productosMostrar.map(({ producto, cantidad }) => (
                                            <li key={producto._id} className="admC-producto-item">
                                                {producto.imagen && /\.(jpe?g|png|webp)$/i.test(producto.imagen) && (
                                                    <img
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        className="admC-producto-img"
                                                    />
                                                )}
                                                <div className="admC-producto-info">
                                                    <span className="admC-producto-nombre">{producto.nombre}</span>
                                                    <span>x {cantidad}</span>
                                                    <span className="admC-producto-subtotal">
                                                        Q{producto.precio * cantidad}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                        {cotizacion.productos.length > 2 && (
                                            <li>
                                                <button
                                                    className="admC-toggle-desc-btn"
                                                    onClick={() => toggleExpand(cotizacion._id)}
                                                >
                                                    {isExpanded ? "Ver menos" : "Ver más"}
                                                </button>
                                            </li>
                                        )}
                                    </ul>

                                    <div className="admC-total">
                                        <strong>Total:</strong>{" "}
                                        Q{cotizacion.productos.reduce(
                                            (acc, { producto, cantidad }) => acc + producto.precio * cantidad,
                                            0
                                        )}
                                    </div>

                                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                        <PDFDownloadLink
                                            document={<CotizacionPDF cotizacion={cotizacion} />}
                                            fileName={`cotizacion-${cotizacion._id}.pdf`}
                                        >
                                            {({ loading }) => loading ? 'Generando PDF...' : 'Descargar PDF'}
                                        </PDFDownloadLink>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </main>
        </div>
    )
}

export default AdminCotizaciones;
