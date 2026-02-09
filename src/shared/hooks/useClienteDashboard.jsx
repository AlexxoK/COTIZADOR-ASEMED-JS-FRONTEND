import { useState } from "react";
import Swal from "sweetalert2";
import { traerProductos, crearCotizacion } from "../../services/api";

export const useClienteDashbordHook = () => {
    const [productosList, setProductosList] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===============================
    // TRAER PRODUCTOS
    // ===============================
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
            });
        } finally {
            setLoading(false);
        }
    };

    // ===============================
    // AGREGAR AL CARRITO
    // ===============================
    const agregarAlCarrito = (producto) => {
        if (!producto?.nombre) return;

        setCarrito((prev) =>
            prev.some((item) => item.nombre === producto.nombre)
                ? prev
                : [
                      ...prev,
                      {
                          nombre: producto.nombre,
                          precioOriginal: producto.precio,
                          precioManual: "",
                          cantidad: 1,
                          subtotal: producto.precio,
                      },
                  ]
        );
    };

    // ===============================
    // QUITAR DEL CARRITO
    // ===============================
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
                setCarrito((prev) =>
                    prev.filter((item) => item.nombre !== nombreProducto)
                );
                Swal.fire({
                    title: "Producto eliminado",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                });
            }
        });
    };

    // ===============================
    // CAMBIAR CANTIDAD
    // ===============================
    const cambiarCantidad = (nombreProducto, cantidad) => {
        if (cantidad < 1) return;

        setCarrito((prev) =>
            prev.map((item) => {
                if (item.nombre !== nombreProducto) return item;

                const precioFinal =
                    item.precioManual !== ""
                        ? Number(item.precioManual)
                        : item.precioOriginal;

                return {
                    ...item,
                    cantidad,
                    subtotal: precioFinal * cantidad,
                };
            })
        );
    };

    // ===============================
    // CAMBIAR PRECIO MANUAL
    // ===============================
    const cambiarPrecio = (nombreProducto, nuevoPrecio) => {
        setCarrito((prev) =>
            prev.map((item) => {
                if (item.nombre !== nombreProducto) return item;

                const precioFinal =
                    nuevoPrecio !== ""
                        ? Number(nuevoPrecio)
                        : item.precioOriginal;

                return {
                    ...item,
                    precioManual: nuevoPrecio,
                    subtotal: precioFinal * item.cantidad,
                };
            })
        );
    };

    // ===============================
    // CALCULAR TOTAL
    // ===============================
    const calcularTotal = () =>
        carrito.reduce((acc, item) => acc + item.subtotal, 0);

    // ===============================
    // CREAR COTIZACIÓN
    // ===============================
    const handleCrearCotizacion = async () => {
        if (!carrito.length) {
            Swal.fire(
                "Carrito vacío",
                "Agrega productos antes de crear la cotización",
                "warning"
            );
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
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);

            const { data } = await crearCotizacion({
                productos: carrito.map((item) => ({
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio:
                        item.precioManual !== ""
                            ? Number(item.precioManual)
                            : item.precioOriginal,
                })),
            });

            Swal.fire({
                title: "Cotización creada",
                text: "La cotización se ha generado correctamente",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setCarrito([]);
            return data.cotizacion;
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: "Error",
                text: backendError?.error || backendError?.msg || "Error al crear la cotización",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // ===============================
    // EXPORT
    // ===============================
    return {
        productosList,
        carrito,
        loading,
        handleTraerProductos,
        agregarAlCarrito,
        quitarDelCarrito,
        cambiarCantidad,
        cambiarPrecio,
        calcularTotal,
        handleCrearCotizacion,
    };
};
