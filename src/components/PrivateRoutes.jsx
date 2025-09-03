import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRoutes = ({ children, roles }) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        return <Navigate to="/" />;
    }

    if (roles && !roles.includes(usuario.role)) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permiso para acceder a este sitio.',
            background: '#1f2937',
            color: 'white'
        })
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export default PrivateRoutes;
