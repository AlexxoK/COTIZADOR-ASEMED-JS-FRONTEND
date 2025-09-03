import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Shield } from "lucide-react";
import { FaUserShield, FaUser } from "react-icons/fa";
import { useClienteHook } from "../../shared/hooks/useUsuarios";
import './Usuario.css';

const AdminUsuarios = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {
        listaUsuarios,
        handleListaUsuarios,
        handleActualizarUsuario,
        handleEliminarUsuario,
        loading
    } = useClienteHook();

    useEffect(() => {
        handleListaUsuarios();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`;
    }

    const toggleRole = async (usuario) => {
        const nuevoRole = usuario.role === "ADMIN" ? "CLIENTE" : "ADMIN";
        await handleActualizarUsuario(usuario.uid, { role: nuevoRole });
    }

    const admins = listaUsuarios.filter(u => u.role === "ADMIN");
    const clientes = listaUsuarios.filter(u => u.role === "CLIENTE");

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main>
                <h1>Gestión de Usuarios</h1>

                {admins.length > 0 && (
                    <>
                        <h2 className="section-title"> <FaUserShield /> Administradores</h2>
                        <ul className="user-list">
                            {admins.map(usuario => (
                                <li key={usuario.uid} className="user-card admin">
                                    <div className="avatar">{getInitials(usuario.nombre, usuario.apellido)}</div>
                                    <div className="user-info">
                                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                                        <div className="role"><Shield size={16} /> {usuario.role}</div>
                                        <p>UID: {usuario.uid}</p>

                                        <div className="user-actions">
                                            <button
                                                className="btn-role-admin"
                                                onClick={() => toggleRole(usuario)}
                                            >
                                                Cambiar Role
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleEliminarUsuario(usuario.uid)}
                                            >
                                                Eliminar Usuario
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {clientes.length > 0 && (
                    <>
                        <h2 className="section-title"> <FaUser /> Clientes</h2>
                        <ul className="user-list">
                            {clientes.map(usuario => (
                                <li key={usuario.uid} className="user-card cliente">
                                    <div className="avatar">{getInitials(usuario.nombre, usuario.apellido)}</div>
                                    <div className="user-info">
                                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                                        <div className="role"><Shield size={16} /> {usuario.role}</div>
                                        <p>UID: {usuario.uid}</p>

                                        <div className="user-actions">
                                            <button
                                                className="btn-role-cliente"
                                                onClick={() => toggleRole(usuario)}
                                            >
                                                Cambiar Role
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleEliminarUsuario(usuario.uid)}
                                            >
                                                Eliminar Usuario
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {!loading && listaUsuarios.length === 0 && <p>No hay usuarios registrados.</p>}
            </main>
        </div>
    )
}

export default AdminUsuarios;
