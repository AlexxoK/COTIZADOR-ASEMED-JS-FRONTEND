import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useClienteHook } from "../../shared/hooks/useUsuarios";
import './ClienteUsuarios.css';

const ClienteUsuarios = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { usuarioLogueado, handleUsuarioLogueado, handleActualizarUsuario, loading } = useClienteHook();

    const [formData, setFormData] = useState({ nombre: "", apellido: "", username: "", correo: "", password: "", phone: "" });

    useEffect(() => {
        handleUsuarioLogueado();
    }, [])

    useEffect(() => {
        if (usuarioLogueado) {
            setFormData({
                nombre: usuarioLogueado.nombre,
                apellido: usuarioLogueado.apellido,
                username: usuarioLogueado.username,
                correo: usuarioLogueado.correo,
                password: "",
                phone: usuarioLogueado.phone
            })
        }
    }, [usuarioLogueado]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = () => {
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        handleActualizarUsuario(usuarioLogueado.uid || usuarioLogueado._id, dataToUpdate);
        setEditMode(false);
    }

    const handleCancel = () => {
        setFormData({
            nombre: usuarioLogueado.nombre,
            apellido: usuarioLogueado.apellido,
            username: usuarioLogueado.username,
            correo: usuarioLogueado.correo,
            password: "",
            phone: usuarioLogueado.phone
        })
        setEditMode(false);
    }

    if (!usuarioLogueado) return <div className="clt-loading">Cargando usuario...</div>;

    const getInitials = (nombre, apellido) => `${nombre?.charAt(0)}${apellido?.charAt(0)}`;

    return (
        <div>
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <main className="clt-main">
                <h1>Mi Perfil</h1>
                <ul className="clt-user-list">
                    <li className="clt-user-card clt-cliente">
                        <div className="clt-avatar">{getInitials(usuarioLogueado.nombre, usuarioLogueado.apellido)}</div>
                        <div className="clt-user-info">
                            <h2>{usuarioLogueado.nombre} {usuarioLogueado.apellido}</h2>
                            <p><strong>Username:</strong> {editMode ? <input type="text" name="username" value={formData.username} onChange={handleChange} /> : usuarioLogueado.username}</p>
                            <p><strong>Correo:</strong> {editMode ? <input type="email" name="correo" value={formData.correo} onChange={handleChange} /> : usuarioLogueado.correo}</p>
                            <p><strong>Teléfono:</strong> {editMode ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} /> : usuarioLogueado.phone}</p>
                            <p><strong>Contraseña:</strong> {editMode ? <input type="password" name="password" placeholder="Vacío para no cambiar" value={formData.password} onChange={handleChange} /> : "********"}</p>
                            <p><strong>NIT:</strong> {editMode ? <input type="text" name="nit" placeholder="Vacío para no cambiar" value={formData.nit} onChange={handleChange} /> : usuarioLogueado.nit}</p>
                            <div className="clt-user-actions">
                                {editMode ? (
                                    <>
                                        <button className="clt-btn-role-cliente" onClick={handleSave} disabled={loading}><FaSave /> Guardar</button>
                                        <button className="clt-btn-delete" onClick={handleCancel}><FaTimes /> Cancelar</button>
                                    </>
                                ) : (
                                    <button className="clt-btn-role-cliente" onClick={() => setEditMode(true)}><FaEdit /> Editar</button>
                                )}
                            </div>
                        </div>
                    </li>
                </ul>
            </main>
        </div>
    )
}

export default ClienteUsuarios;
