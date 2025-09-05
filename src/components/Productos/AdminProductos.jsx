import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useProductoHook } from "../../shared/hooks/useProductos";
import "./AdminProductos.css";

const AdminProductos = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { productosList, handleTraerProductos, handleActualizarProducto, handleEliminarProducto, handleActivarProducto } = useProductoHook();

    const [expandedDesc, setExpandedDesc] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const productsPerPage = 30;
    const maxLength = 100;

    const categoriasDisponibles = [
        ...new Set(productosList.map((p) => p.categoria).filter(Boolean)),
    ]

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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleDescription = (id) =>
        setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));

    const startEditing = (producto) => {
        setEditingId(producto._id);
        setFormData({
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            categoria: producto.categoria || "",
            precio: producto.precio || "",
            enlace: producto.enlace || "",
            estado: producto.estado || false,
        })
    }

    const cancelEditing = () => {
        setEditingId(null);
        setFormData({});
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e, id) => {
        e.preventDefault();
        await handleActualizarProducto(id, formData);
        cancelEditing();
    }

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
            <main className="adm-main">
                <h1>Gestión de Productos</h1>

                <div className="adm-search-bar">
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="adm-category-select-container">
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
                        <ul className="adm-productos-list">
                            {currentProducts.map((producto) => {
                                const isExpanded = expandedDesc[producto._id];
                                const shortDesc = producto.descripcion?.slice(0, maxLength);
                                const isEditing = editingId === producto._id;

                                return (
                                    <li key={producto._id} className="adm-producto-card uniform-card">
                                        {producto.imagen && (
                                            <img
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                                className="adm-producto-imagen"
                                            />
                                        )}

                                        {isEditing ? (
                                            <form onSubmit={(e) => handleSubmit(e, producto._id)}>
                                                <h2>Editar Producto</h2>
                                                <input
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    placeholder="Nombre"
                                                />
                                                <textarea
                                                    name="descripcion"
                                                    value={formData.descripcion}
                                                    onChange={handleChange}
                                                    placeholder="Descripción"
                                                />
                                                <input
                                                    name="categoria"
                                                    value={formData.categoria}
                                                    onChange={handleChange}
                                                    placeholder="Categoría"
                                                />
                                                <input
                                                    name="precio"
                                                    type="number"
                                                    value={formData.precio}
                                                    onChange={handleChange}
                                                    placeholder="Precio"
                                                />
                                                <input
                                                    name="enlace"
                                                    value={formData.enlace}
                                                    onChange={handleChange}
                                                    placeholder="Enlace"
                                                />
                                                <div className="adm-modal-actions">
                                                    <button type="submit">Guardar</button>
                                                    <button type="button" onClick={cancelEditing}>
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <h2>{producto.nombre}</h2>
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
                                                                className="adm-toggle-desc-btn"
                                                            >
                                                                {isExpanded ? "Mostrar menos" : "Mostrar más"}
                                                            </button>
                                                        )}
                                                    </p>
                                                )}
                                                {producto.categoria && (
                                                    <p>
                                                        <strong>Categoría:</strong> {producto.categoria}
                                                    </p>
                                                )}
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
                                                <p>
                                                    <strong>Estado:</strong>{" "}
                                                    {producto.estado ? "Activo" : "Inactivo"}
                                                </p>

                                                <div className="adm-action-buttons">
                                                    {producto.estado ? (
                                                        <>
                                                            <button
                                                                className="adm-btn-editar"
                                                                onClick={() => startEditing(producto)}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                className="adm-btn-eliminar"
                                                                onClick={() => handleEliminarProducto(producto._id)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className="adm-btn-activar"
                                                            onClick={() => handleActivarProducto(producto._id)}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>

                        {totalPages > 1 && (
                            <div className="adm-pagination-card">
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
                    </>
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </main>
        </div>
    )
}

export default AdminProductos;
