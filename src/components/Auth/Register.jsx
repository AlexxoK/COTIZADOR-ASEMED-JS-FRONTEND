import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import Swal from "sweetalert2";
import './Register.css';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        username: "",
        correo: "",
        password: "",
        phone: "",
        role: "CLIENTE"
    })

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData);
            Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: "Bienvenido a ASEMED!",
                background: '#1f2937',
                color: 'white',
            })

            setFormData({
                nombre: "",
                apellido: "",
                username: "",
                correo: "",
                password: "",
                phone: "",
                role: "CLIENTE"
            })

            navigate("/");
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.msg || "Ocurrió un error inesperado";
            Swal.fire({
                icon: "error",
                title: "Error al registrarse",
                text: errorMsg,
                background: '#1f2937',
                color: 'white',
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Escribe tu nombre" required maxLength={25} />

                    <label>Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Escribe tu apellido" required maxLength={25} />

                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Escribe tu usuario" required />

                    <label>Correo</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Escribe tu correo con @" required />

                    <label>Teléfono</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Escribe tu teléfono" required minLength={8} maxLength={8} />

                    <label>Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Escribe tu contraseña" required minLength={8} />

                    <label>NIT</label>
                    <input type="text" name="nit" value={formData.nit} onChange={handleChange} placeholder="Escribe tu NIT o C/F" maxLength={9} />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="login-link">
                    ¿Ya tienes cuenta?{" "}
                    <span onClick={() => navigate("/")}>Inicia sesión</span>
                </p>
            </div>
        </div>
    )
}

export default RegisterForm;
