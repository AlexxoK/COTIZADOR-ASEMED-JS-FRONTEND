import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useClienteDashbordHook } from "../../shared/hooks/useClienteDashboard";
import "./ClienteDashboard.css";

const ClienteDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { productosList, handleTraerProductos } = useClienteDashbordHook();

    const [expandedDesc, setExpandedDesc] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const productsPerPage = 15;
    const maxLength = 100;

    useEffect(() => {
        handleTraerProductos();
    }, [])

    useEffect(() => {
        let result = [...productosList];

        if (searchCategory) {
            result = result.filter(
                (p) => p.categoria?.toLowerCase() === searchCategory.toLowerCase()
            )
        }

        if (search) {
            result = result.filter((p) =>
                p.nombre?.toLowerCase().includes(search.toLowerCase())
            )
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [productosList, search, searchCategory]);

    const categoriasDisponibles = [
        ...new Set(productosList.map((p) => p.categoria).filter(Boolean)),
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleDescription = (id) =>
        setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    )

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="cliente-dashboard">
                <h1>Productos disponibles</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="category-select-container">
                    <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <option value="">-- Elige una categoría --</option>
                        {categoriasDisponibles.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {filteredProducts.length > 0 ? (
                    <>
                        <ul className="productos-list">
                            {currentProducts.map((producto) => {
                                const isExpanded = expandedDesc[producto._id];
                                const shortDesc = producto.descripcion?.slice(0, maxLength);

                                return (
                                    <li key={producto._id} className="producto-card uniform-card">
                                        {producto.imagen && (
                                            <img
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                                className="producto-imagen"
                                            />
                                        )}

                                        <h3>{producto.nombre}</h3>
                                        {producto.descripcion && (
                                            <p>
                                                {isExpanded
                                                    ? producto.descripcion
                                                    : shortDesc +
                                                    (producto.descripcion.length > maxLength
                                                        ? "..."
                                                        : "")}
                                                {producto.descripcion.length > maxLength && (
                                                    <button
                                                        onClick={() => toggleDescription(producto._id)}
                                                        className="toggle-desc-btn"
                                                    >
                                                        {isExpanded ? "Mostrar menos" : "Mostrar más"}
                                                    </button>
                                                )}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Categoría:</strong> {producto.categoria}
                                        </p>
                                        <p>
                                            <strong>Precio:</strong> Q {producto.precio}
                                        </p>
                                        {producto.enlace && (
                                            <p>
                                                <strong>Enlace:</strong>{" "}
                                                <a
                                                    href={producto.enlace}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Ver más
                                                </a>
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {totalPages > 1 && (
                            <div className="pagination-card">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={currentPage === page ? "current-page" : ""}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </main>
        </div>
    )
}

export default ClienteDashboard;
