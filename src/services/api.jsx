import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://cotizador-asemed-js.vercel.app/cotizador/v1/',
    timeout: 10000,

})

apiClient.interceptors.request.use(
    (config) => {
        const storedUsuario = localStorage.getItem('usuario')

        if (storedUsuario) {
            try {
                const { token } = JSON.parse(storedUsuario)
                if (token) {
                    config.headers["x-token"] = token;
                }
            } catch (error) {
                console.log("Error en el interceptor de la petición", error)
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export const register = async (data) => {
    return await apiClient.post('auth/register', data)
}

export const login = async (data) => {
    return await apiClient.post('auth/login', data)
}

export const traerUsuarios = async () => {
    return await apiClient.get('usuarios/traerUsuarios')
}

export const traerUsuarioLogueado = async () => {
    return await apiClient.get('usuarios/traerUsuarioLogueado')
}

export const actualizarUsuario = async (id, data) => {
    return await apiClient.put(`usuarios/actualizarUsuario/${id}`, data)
}

export const eliminarUsuario = async (id) => {
    return await apiClient.delete(`usuarios/eliminarUsuario/${id}`)
}

export const traerProductos = async () => {
    return await apiClient.get('productos/traerProductos')
}

export const actualizarProducto = async (id, data) => {
    return await apiClient.put(`productos/actualizarProducto/${id}`, data)
}

export const eliminarProducto = async (id) => {
    return await apiClient.delete(`productos/eliminarProducto/${id}`)
}

export const crearCotizacion = async (data) => {
    return await apiClient.post('cotizaciones/crearCotizacion', data)
}

export const traerCotizaciones = async () => {
    return await apiClient.get('cotizaciones/traerCotizaciones')
}

export const actualizarEstadoCotizacion = async (id, estado) => {
    return await apiClient.put(`cotizaciones/actualizarEstadoCotizacion/${id}`, estado)
}
