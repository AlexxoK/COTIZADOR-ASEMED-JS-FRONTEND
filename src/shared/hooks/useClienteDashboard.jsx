import { useState } from "react";
import Swal from "sweetalert2";
import { traerProductos, crearCotizacion } from "../../services/api";

export const useClienteDashbordHook = () => {
    const [productosList, setProductosList] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTraerProductos = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await traerProductos();
            setProductosList(data.productos);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: "Error",
                text: backendError?.error || backendError?.msg || "Error al cargar productos",
                icon: "error",
            })
        } finally {
            setLoading(false);
        }
    }

    const agregarAlCarrito = (producto) => {
        if (!producto?.nombre) return;

        setCarrito((prev) =>
            prev.some((item) => item.nombre === producto.nombre)
                ? prev
                : [
                    ...prev,
                    {
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: 1,
                        subtotal: producto.precio,
                    },
                ]
        )
    }

    const quitarDelCarrito = (nombreProducto) => {
        Swal.fire({
            title: "¿Eliminar producto?",
            text: "¿Deseas quitar este producto del carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, quitar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444",
        }).then((result) => {
            if (result.isConfirmed) {
                setCarrito((prev) => prev.filter((item) => item.nombre !== nombreProducto));
                Swal.fire({
                    title: "Producto eliminado",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                })
            }
        })
    }

    const cambiarCantidad = (nombreProducto, cantidad) => {
        if (cantidad < 1) return;
        setCarrito((prev) =>
            prev.map((item) =>
                item.nombre === nombreProducto
                    ? { ...item, cantidad, subtotal: item.precio * cantidad }
                    : item
            )
        )
    }

    const calcularTotal = () => carrito.reduce((acc, item) => acc + item.subtotal, 0);

    const handleCrearCotizacion = async () => {
        if (!carrito.length) {
            Swal.fire("Carrito vacío", "Agrega productos antes de crear la cotización", "warning");
            return;
        }

        const confirm = await Swal.fire({
            title: "Crear cotización",
            text: `¿Deseas crear la cotización con ${carrito.length} producto(s)?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, crear",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#10b981",
        })

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            const { data } = await crearCotizacion({
                productos: carrito.map(({ nombre, cantidad }) => ({ nombre, cantidad })),
            })

            Swal.fire({
                title: "Cotización creada",
                text: "La cotización se ha generado correctamente",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            })

            setCarrito([]);
            return data.cotizacion;
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: "Error",
                text: backendError?.error || backendError?.msg || "Error al crear la cotización",
                icon: "error",
            })
        } finally {
            setLoading(false);
        }
    }

    return { productosList, carrito, loading, handleTraerProductos, agregarAlCarrito, quitarDelCarrito, cambiarCantidad, calcularTotal, handleCrearCotizacion, };
}
