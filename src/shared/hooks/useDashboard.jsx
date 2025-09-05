import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const UsuariosAdminNavigate = () => {
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);
    const navigate = useNavigate();

    const handleUsuariosAdmin = async () => {
        try {
            console.log("Usuarios");
            navigate("/AdminUsuarios", { state: { message: "Bienvenido a Gestión de Usuarios" } })
        } catch (error) {
            console.log(error)
        }
    }
    return { usuariosAdmin, handleUsuariosAdmin }
}

export const UsuariosClienteNavigate = () => {
    const [usuariosCliente, setUsuariosCliente] = useState([]);
    const navigate = useNavigate();

    const handleUsuariosCliente = async () => {
        try {
            console.log("Usuarios");
            navigate("/ClienteUsuarios", { state: { message: "Bienvenido a Gestión de Usuarios" } })
        } catch (error) {
            console.log(error)
        }
    }
    return { usuariosCliente, handleUsuariosCliente }
}

export const ProductosAdminNavigate = () => {
    const [productosAdmin, setProductosAdmin] = useState([]);
    const navigate = useNavigate();

    const handleProductosAdmin = async () => {
        try {
            console.log("Productos");
            navigate("/AdminProductos", { state: { message: "Bienvenido a Gestión de Productos" } })
        } catch (error) {
            console.log(error)
        }
    }
    return { productosAdmin, handleProductosAdmin }
}

export const CotizacionesAdminNavigate = () => {
    const [cotizacionesAdmin, setCotizacionesAdmin] = useState([]);
    const navigate = useNavigate();

    const handleCotizacionesAdmin = async () => {
        try {
            console.log("Cotizaciones");
            navigate("/AdminCotizaciones", { state: { message: "Bienvenido a Gestión de Cotizaciones" } })
        } catch (error) {
            console.log(error)
        }
    }
    return { cotizacionesAdmin, handleCotizacionesAdmin }
}

export const CotizacionesClienteNavigate = () => {
    const [cotizacionesCliente, setCotizacionesCliente] = useState([]);
    const navigate = useNavigate();

    const handleCotizacionesCliente = async () => {
        try {
            console.log("Cotizaciones");
            navigate("/ClienteCotizaciones", { state: { message: "Bienvenido a Gestión de Cotizaciones" } })
        } catch (error) {
            console.log(error)
        }
    }
    return { cotizacionesCliente, handleCotizacionesCliente }
}
