import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { traerCotizaciones, actualizarEstadoCotizacion } from "../../services/api";

export const useCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTraerCotizaciones = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await traerCotizaciones();
            if (data.success) {
                setCotizaciones(data.cotizaciones);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener las cotizaciones",
                    icon: "error",
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.msg || "Error al traer cotizaciones",
                icon: "error",
            })
        } finally {
            setLoading(false);
        }
    }

    const handleActualizarEstadoCotizacion = async (id, estado) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas actualizar el estado de esta cotización?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar",
            color: "white",
            background: "#1f2937",
        })

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            const { data } = await actualizarEstadoCotizacion(id, { estado });

            if (data.success) {
                Swal.fire({
                    title: "Estado actualizado",
                    text: data.msg,
                    icon: "success",
                    timer: 1500,
                    color: "white",
                    background: "#1f2937",
                });

                setCotizaciones((prev) =>
                    prev.map((c) => (c._id === id ? data.cotizacion : c))
                )
            }
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: "Error",
                text: backendError?.error || backendError?.msg || "No se pudo actualizar el estado",
                icon: "error",
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleTraerCotizaciones();
    }, [])

    return { cotizaciones, loading, handleTraerCotizaciones, handleActualizarEstadoCotizacion, }
}
