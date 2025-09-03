import { useRoutes } from "react-router-dom";
import PrivateRoutes from "../../components/PrivateRoutes";
import Login from "../../components/Auth/Login.jsx"
import Register from "../../components/Auth/Register.jsx"
import Dashboard from "../../components/Dashboard/Dashboard.jsx"
import AdminUsuarios from "../../components/Usuarios/AdminUsuarios.jsx"
import AdminProductos from "../../components/Productos/AdminProductos.jsx"

const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Login /> },

        { path: "/register", element: <Register /> },

        {
            path: "/dashboard", element: (
                <PrivateRoutes>
                    <Dashboard />
                </PrivateRoutes>
            )
        },
        {
            path: "/AdminUsuarios", element: (
                <PrivateRoutes roles={['ADMIN']}>
                    <AdminUsuarios />
                </PrivateRoutes>
            )
        },
        {
            path: "/AdminProductos", element: (
                <PrivateRoutes roles={['ADMIN']}>
                    <AdminProductos />
                </PrivateRoutes>
            )
        },
    ])
    return routes;
}

export default AppRoutes;
