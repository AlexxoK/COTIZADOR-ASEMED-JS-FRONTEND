import { useNavigate } from "react-router-dom";
import { ChevronLeft, Box, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import './Sidebar.css';
import { UsuariosAdminNavigate } from "../../shared/hooks/useDashboard";
import { ProductosAdminNavigate } from "../../shared/hooks/useDashboard";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const sidebarRef = useRef(null);

    const { handleUsuariosAdmin } = UsuariosAdminNavigate();
    const { handleProductosAdmin } = ProductosAdminNavigate();

    const getInitials = (nombre) => {
        return nombre?.charAt(0)?.toUpperCase() || 'U';
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, toggleSidebar]);

    const clientSections = [

    ]

    const adminSections = [
        { text: 'Gestión de Usuarios', icon: <User />, action: handleUsuariosAdmin },
        { text: 'Gestión de Productos', icon: <Box />, action: handleProductosAdmin },
    ]

    const sections = usuario?.role === 'ADMIN' ? adminSections : clientSections;

    return (
        <>
            <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>{usuario?.role === 'ADMIN' ? 'Admin InnovaQ' : 'Mi Cuenta'}</h2>
                    <button onClick={toggleSidebar} aria-label="Toggle sidebar">
                        <ChevronLeft />
                    </button>
                </div>

                <div className="sidebar-profile">
                    <div className="sidebar-profile-avatar">
                        {getInitials(usuario?.nombre)}
                    </div>
                    <div className="sidebar-profile-info">
                        <p>{usuario?.nombre || 'Usuario'} {usuario?.apellido || 'Usuario'}</p>
                        <p>{usuario?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {sections.map((section, index) => (
                            <li key={index}>
                                <button
                                    className="sidebar-nav-button"
                                    onClick={() => {
                                        section.action();
                                        toggleSidebar();
                                    }}
                                >
                                    <span className="sidebar-nav-icon">{section.icon}</span>
                                    <span className="sidebar-nav-text">{section.text}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </>
    )
}

export default Sidebar;
