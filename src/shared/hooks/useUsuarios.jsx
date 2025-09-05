import { useState } from "react";
import Swal from "sweetalert2";
import { traerUsuarios, actualizarUsuario, eliminarUsuario, traerUsuarioLogueado } from "../../services/api";

export const useClienteHook = () => {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [usuarioLogueado, setUsuarioLogueado] = useState(null);
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

    const handleUsuarioLogueado = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await traerUsuarioLogueado();
            console.log(response, "Usuario Logueado");
            setUsuarioLogueado(response.data.usuario);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al traer usuario logueado',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handleActualizarUsuario = async (id, data) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas actualizar este usuario?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar',
            color: 'white',
            background: '#1f2937',
            customClass: { popup: 'animate__animated animate__fadeInDown' }
        })

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await actualizarUsuario(id, data);
                console.log(response, "Usuario Actualizado");

                await Swal.fire({
                    title: 'Usuario Actualizado',
                    text: 'El usuario ha sido actualizado exitosamente',
                    icon: 'success',
                    timer: 1500,
                    color: 'white',
                    background: '#1f2937',
                    customClass: { popup: 'animate__animated animate__fadeInDown' }
                })

                await handleListaUsuarios();
            } catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error',
                    text: backendError?.error || backendError?.msg || 'Error al actualizar usuario',
                    icon: 'error'
                })
            } finally {
                setLoading(false);
            }
        }
    }

    const handleEliminarUsuario = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el usuario permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            color: 'white',
            background: '#1f2937',
            customClass: { popup: 'animate__animated animate__fadeInDown' }
        })

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await eliminarUsuario(id);
                console.log(response, "Usuario Eliminado");

                await Swal.fire({
                    title: 'Usuario Eliminado',
                    text: 'El usuario ha sido eliminado exitosamente',
                    icon: 'success',
                    timer: 1500,
                    color: 'white',
                    background: '#1f2937',
                    customClass: { popup: 'animate__animated animate__fadeInDown' }
                })

                await handleListaUsuarios();
            } catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error',
                    text: backendError?.error || backendError?.msg || 'Error al eliminar usuario',
                    icon: 'error'
                })
            } finally {
                setLoading(false);
            }
        }
    }

    return { listaUsuarios, usuarioLogueado, handleListaUsuarios, handleUsuarioLogueado, handleActualizarUsuario, handleEliminarUsuario, loading };
}
