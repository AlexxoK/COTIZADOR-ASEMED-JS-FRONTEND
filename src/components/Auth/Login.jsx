import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../shared/hooks/useLogin";
import Swal from "sweetalert2";
import './Login.css';

const LoginForm = () => {
    const { handleLogin } = useLogin();
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await handleLogin(correo, password);

            await Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso!',
                text: 'Bienvenido a ASEMED!',
                background: '#1f2937',
                color: 'white',
                timer: 2000,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            })

            navigate("/dashboard");
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.msg || 'Ocurrió un error inesperado';
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: errorMsg,
                background: '#1f2937',
                color: 'white',
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>ASEMED</h2>
                <form onSubmit={onSubmit}>
                    <label>Correo</label>
                    <input
                        type="text"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="Escribe tu correo con @"
                        required
                    />
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Escribe tu contraseña"
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Ingresando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <p className="register-link">
                    ¿No tienes cuenta?{" "}
                    <span onClick={() => navigate("/register")}>Regístrate aquí</span>
                </p>
            </div>
        </div>
    )
}

export default LoginForm;
