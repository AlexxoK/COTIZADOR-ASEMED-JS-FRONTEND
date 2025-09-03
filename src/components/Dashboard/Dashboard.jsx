import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import ClienteDashboard from "./ClienteDashboard";

const Dashboard = () => {
    const location = useLocation();
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (location.state?.message) {
        console.log(location.state.message)
    }

    return usuario?.role === 'ADMIN' ? <AdminDashboard /> : <ClienteDashboard />;
}

export default Dashboard;
