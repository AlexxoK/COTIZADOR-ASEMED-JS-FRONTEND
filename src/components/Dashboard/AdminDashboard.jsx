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
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`;
    };

    const admins = listaUsuarios.filter(u => u.role?.toLowerCase() === "admin");
    const clientes = listaUsuarios.filter(u => u.role?.toLowerCase() === "cliente");

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main>
                <h1>Usuarios Registrados</h1>

                {admins.length > 0 && (
                    <>
                        <h2 className="section-title"> <FaUserShield /> Administradores</h2>
                        <ul className="user-list">
                            {admins.map((usuario) => (
                                <li key={usuario.uid} className={`user-card admin`}>
                                    <div className="avatar">
                                        {getInitials(usuario.nombre, usuario.apellido)}
                                    </div>
                                    <div className="user-info">
                                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                                        <div className="role"><Shield size={16} /> {usuario.role}</div>
                                        <p><Mail /> {usuario.correo}</p>
                                        <p><Phone /> {usuario.phone}</p>
                                        <p><Hash /> {usuario.uid}</p>
                                        <p>
                                            {usuario.estado ? (
                                                <span className="status active"><CheckCircle size={14} /> Activo</span>
                                            ) : (
                                                <span className="status inactive"><XCircle size={14} /> Inactivo</span>
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
                        <h2 className="section-title"> <FaUser /> Clientes</h2>
                        <ul className="user-list">
                            {clientes.map((usuario) => (
                                <li key={usuario.uid} className={`user-card cliente`}>
                                    <div className="avatar">
                                        {getInitials(usuario.nombre, usuario.apellido)}
                                    </div>
                                    <div className="user-info">
                                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                                        <div className="role"><Shield size={16} /> {usuario.role}</div>
                                        <p><Mail /> {usuario.correo}</p>
                                        <p><Phone /> {usuario.phone}</p>
                                        <p><Hash /> {usuario.uid}</p>
                                        <p>
                                            {usuario.estado ? (
                                                <span className="status active"><CheckCircle size={14} /> Activo</span>
                                            ) : (
                                                <span className="status inactive"><XCircle size={14} /> Inactivo</span>
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
    );
}

export default AdminDashboard;
