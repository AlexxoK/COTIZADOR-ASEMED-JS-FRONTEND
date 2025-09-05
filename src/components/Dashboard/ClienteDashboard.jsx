import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useClienteDashbordHook } from "../../shared/hooks/useClienteDashboard";
import "./ClienteDashboard.css";

const ClienteDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedDesc, setExpandedDesc] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    const { productosList, carrito, handleTraerProductos, agregarAlCarrito, quitarDelCarrito, cambiarCantidad, calcularTotal, handleCrearCotizacion, loading } = useClienteDashbordHook();

    useEffect(() => {
        handleTraerProductos();
    }, [])

    const filteredProducts = productosList
        .filter(p => !searchCategory || p.categoria?.toLowerCase() === searchCategory.toLowerCase())
        .filter(p => !search || p.nombre?.toLowerCase().includes(search.toLowerCase()));

    const categoriasDisponibles = [...new Set(productosList.map(p => p.categoria).filter(Boolean))];

    const productsPerPage = 30;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const toggleDescription = id => setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div>
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <main className="ctl-dashboard">
                <h1>Productos disponibles</h1>

                <div className="ctl-search-bar">
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="ctl-category-select-container">
                    <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                        <option value="">-- Elige una categoría --</option>
                        {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {filteredProducts.length > 0 ? (
                    <ul className="ctl-productos-list">
                        {currentProducts.map(p => {
                            const isExpanded = expandedDesc[p._id];
                            const shortDesc = p.descripcion?.slice(0, 100);

                            return (
                                <li key={p._id} className="ctl-producto-card uniform-card">
                                    {p.imagen && <img src={p.imagen} alt={p.nombre} className="ctl-producto-imagen" />}
                                    <h3>{p.nombre}</h3>
                                    {p.descripcion && (
                                        <p>
                                            {isExpanded ? p.descripcion : shortDesc + (p.descripcion.length > 100 ? "..." : "")}
                                            {p.descripcion.length > 100 && (
                                                <button onClick={() => toggleDescription(p._id)} className="ctl-toggle-desc-btn">
                                                    {isExpanded ? "Mostrar menos" : "Mostrar más"}
                                                </button>
                                            )}
                                        </p>
                                    )}
                                    <p><strong>Categoría:</strong> {p.categoria}</p>
                                    <p><strong>Precio:</strong> Q {p.precio}</p>
                                    {p.enlace && <p><a href={p.enlace} target="_blank" rel="noopener noreferrer">Ver más</a></p>}
                                    <button onClick={() => agregarAlCarrito(p)}>Agregar al carrito</button>
                                </li>
                            )
                        })}
                    </ul>
                ) : <p>No hay productos disponibles.</p>}

                {totalPages > 1 && (
                    <div className="ctl-pagination-card">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>

                        {(() => {
                            const maxPagesToShow = 10;
                            let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
                            let endPage = startPage + maxPagesToShow - 1;

                            if (endPage > totalPages) {
                                endPage = totalPages;
                                startPage = Math.max(endPage - maxPagesToShow + 1, 1);
                            }

                            const pageNumbers = [];
                            for (let i = startPage; i <= endPage; i++) {
                                pageNumbers.push(i);
                            }

                            return pageNumbers.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "current-page" : ""}
                                >
                                    {page}
                                </button>
                            ))
                        })()}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                )}


                <div className="ctl-carrito">
                    <h2>🛒 Carrito ({carrito.length})</h2>
                    {carrito.length > 0 ? (
                        <ul className="ctl-carrito-list">
                            {carrito.map(item => (
                                <li key={item.nombre} className="ctl-carrito-item">
                                    <span className="ctl-carrito-nombre">{item.nombre}</span>
                                    <div className="ctl-carrito-cantidad">
                                        <button onClick={() => cambiarCantidad(item.nombre, Math.max(item.cantidad - 1, 1))} className="ctl-btn-icon"><FaMinus /></button>
                                        <input type="number" min="1" value={item.cantidad} onChange={e => cambiarCantidad(item.nombre, Number(e.target.value))} />
                                        <button onClick={() => cambiarCantidad(item.nombre, item.cantidad + 1)} className="ctl-btn-icon"><FaPlus /></button>
                                    </div>
                                    <span className="ctl-carrito-subtotal">Q{item.subtotal}</span>
                                    <button onClick={() => quitarDelCarrito(item.nombre)} className="ctl-btn-trash" title="Quitar del carrito"><FaTrash /></button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No hay productos seleccionados.</p>}
                    <div className="ctl-carrito-total"><strong>Total: Q{calcularTotal()}</strong></div>
                    <button onClick={handleCrearCotizacion} disabled={carrito.length === 0 || loading} className="ctl-btn-crear">{loading ? "Creando..." : "Crear Cotización"}</button>
                </div>
            </main>
        </div>
    )
}

export default ClienteDashboard;
