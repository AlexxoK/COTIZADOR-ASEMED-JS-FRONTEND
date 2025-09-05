import { useState } from "react";
import Swal from "sweetalert2";
import { traerUsuarios } from "../../services/api";

export const useAdminDashboardHook = () => {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleListaUsuarios = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await traerUsuarios();
            console.log(response, "ListaUsuarios");
            setListaUsuarios(response.data.usuarios);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    return { listaUsuarios, handleListaUsuarios, loading };
}
