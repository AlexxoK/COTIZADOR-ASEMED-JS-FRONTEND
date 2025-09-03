import { useState } from "react";
import { login as loginService } from "../../services/api";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loginSucces, setLoginSucces] = useState(false);

    const handleLogin = async (correo, password) => {
        setIsLoading(true);
        try {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
            const response = await loginService({
                [isEmail ? "correo" : "username"]: correo,
                password
            })

            const { userDetails } = response.data;
            localStorage.setItem("usuario", JSON.stringify(userDetails));

            setLoginSucces(true);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.msg || 'Ocurrió un error inesperado';
            setLoginError(errorMsg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { handleLogin, loginError, loginSucces, isLoading };
}
