import { useState } from "react";
import Swal from "sweetalert2";
import { traerProductos } from "../../services/api";

export const useClienteDashbordHook = () => {
    const [productosList, setProductosList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTraerProductos = async () => {
        try {
            const response = await traerProductos();
            console.log(response, "Productos");
            setProductosList(response.data.productos);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error',
                icon: 'error'
            })
        }
    }

    return { productosList, handleTraerProductos, loading }
}
