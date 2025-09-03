import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Cross } from 'lucide-react';
import Swal from 'sweetalert2';
import { useLogout as logoutHandler } from '../../shared/hooks/useLogout';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const handleLogout = () => {
        Swal.fire({
            title: 'Cerrando sesión',
            text: '¿Estás seguro que deseas salir?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: '#fff',
            backdrop: 'rgba(0,0,0,0.8)'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Sesión cerrada',
                    text: 'Has cerrado sesión exitosamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1f2937',
                    color: '#fff'
                }).then(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    logoutHandler();
                    navigate('/');
                })
            }
        })
    }

    const getInitials = (nombre, apellido) => {
        const firstInitial = nombre?.charAt(0)?.toUpperCase() || '';
        const lastInitial = apellido?.charAt(0)?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    }

    return (
        <header className="navbar-header">
            <div>
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                    className="navbar-button">
                    <Menu />
                </button>

                <a href="/dashboard" className="navbar-logo-link">
                    <Cross />
                    <span>{usuario?.role === 'ADMIN' ? 'ASEMED | Administración' : 'ASEMED'}</span>
                </a>
            </div>

            <div>
                <div className="navbar-user-info">
                    <div className="navbar-user-avatar">
                        {getInitials(usuario?.nombre, usuario?.apellido) || 'U'}
                    </div>
                    <span className="navbar-user-name">
                        {usuario?.nombre || 'Usuario'} {usuario?.apellido || ''}
                    </span>
                </div>

                <button onClick={handleLogout} className="navbar-logout-button">
                    <LogOut />
                    <span>Salir</span>
                </button>
            </div>
        </header>
    )
}

export default Navbar;
