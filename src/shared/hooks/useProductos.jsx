import { useState } from "react";
import Swal from "sweetalert2";
import { traerProductos, actualizarProducto, eliminarProducto } from "../../services/api";

export const useProductoHook = () => {
    const [productosList, setProductosList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTraerProductos = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await traerProductos();
            setProductosList(response.data.productos);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al traer productos',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handleActualizarProducto = async (id, data) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas actualizar este producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar',
            color: 'white',
            background: '#1f2937'
        })

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            const response = await actualizarProducto(id, data);
            Swal.fire({
                title: 'Producto Actualizado',
                text: 'El producto ha sido actualizado exitosamente',
                icon: 'success',
                timer: 1500,
                color: 'white',
                background: '#1f2937'
            })
            setProductosList(prev =>
                prev.map(p => (p._id === id ? response.data.producto : p))
            )
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al actualizar producto',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handleEliminarProducto = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción desactivará el producto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
            color: 'white',
            background: '#1f2937'
        })

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            await eliminarProducto(id);
            Swal.fire({
                title: 'Producto Desactivado',
                text: 'El producto ha sido desactivado correctamente',
                icon: 'success',
                timer: 1500,
                color: 'white',
                background: '#1f2937'
            })
            setProductosList(prev =>
                prev.map(p => (p._id === id ? { ...p, estado: false } : p))
            )
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al desactivar producto',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handleActivarProducto = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción activará el producto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            color: 'white',
            background: '#1f2937'
        })

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            await actualizarProducto(id, { estado: true });
            Swal.fire({
                title: 'Producto Activado',
                text: 'El producto ha sido activado correctamente',
                icon: 'success',
                timer: 1500,
                color: 'white',
                background: '#1f2937'
            })
            setProductosList(prev =>
                prev.map(p => (p._id === id ? { ...p, estado: true } : p))
            )
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al activar producto',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    return { productosList, handleTraerProductos, handleActualizarProducto, handleEliminarProducto, handleActivarProducto, loading }
}
