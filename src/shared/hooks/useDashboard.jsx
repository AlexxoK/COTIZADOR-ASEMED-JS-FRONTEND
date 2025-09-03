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
