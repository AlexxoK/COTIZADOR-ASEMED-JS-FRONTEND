import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useAdminDashboardHook } from "../../shared/hooks/useAdminDashboard";
import { Mail, Phone, Shield, Hash, CheckCircle, XCircle } from "lucide-react";
import { FaUser, FaUserShield } from "react-icons/fa";
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { listaUsuarios, handleListaUsuarios, loading } = useAdminDashboardHook();

    useEffect(() => {
        handleListaUsuarios();
    }, [])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`;
    }

    const admins = listaUsuarios.filter(u => u.role?.toLowerCase() === "admin");
    const clientes = listaUsuarios.filter(u => u.role?.toLowerCase() === "cliente");

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="adm-main">
                <h1>Usuarios Registrados</h1>

                {admins.length > 0 && (
                    <>
                        <h2 className="adm-section-title">
                            <span className="adm-section-icon"><FaUserShield /></span>
                            Administradores
                        </h2>
                        <ul className="adm-user-list">
                            {admins.map((usuario) => (
                                <li key={usuario.uid} className={`adm-user-card admin`}>
                                    <div className="adm-avatar">{getInitials(usuario.nombre, usuario.apellido)}</div>
                                    <div className="adm-user-info">
                                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                                        <div className="role"><Shield size={16} /> {usuario.role}</div>
                                        <p><Mail /> {usuario.correo}</p>
                                        <p><Phone /> {usuario.phone}</p>
                                        <p><Hash /> {usuario.uid}</p>
                                        <p>
                                            {usuario.estado ? (
                                                <span className="adm-status active"><CheckCircle size={14} /> Activo</span>
                                            ) : (
                                                <span className="adm-status inactive"><XCircle size={14} /> Inactivo</span>
                                            )}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {clientes.length > 0 && (
                    <>
                        <h2 className="adm-section-title">
                            <span className="adm-section-icon"><FaUser /></span>
                            Clientes
                        </h2>
                        <ul className="adm-user-list">
                            {clientes.map((usuario) => (
                                <li key={usuario.uid} className={`adm-user-card cliente`}>
                                    <div className="adm-avatar">{getInitials(usuario.nombre, usuario.apellido)}</div>
                                    <div className="adm-user-info">
                                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                                        <div className="role"><Shield size={16} /> {usuario.role}</div>
                                        <p><Mail /> {usuario.correo}</p>
                                        <p><Phone /> {usuario.phone}</p>
                                        <p><Hash /> {usuario.uid}</p>
                                        <p>
                                            {usuario.estado ? (
                                                <span className="adm-status active"><CheckCircle size={14} /> Activo</span>
                                            ) : (
                                                <span className="adm-status inactive"><XCircle size={14} /> Inactivo</span>
                                            )}
                                        </p>
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

export default AdminDashboard;
