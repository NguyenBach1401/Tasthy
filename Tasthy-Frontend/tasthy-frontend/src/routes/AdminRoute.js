import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!isLoggedIn || role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
