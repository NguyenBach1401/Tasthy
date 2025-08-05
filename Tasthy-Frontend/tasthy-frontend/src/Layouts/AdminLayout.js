import { Outlet } from 'react-router-dom';
import Sidebar from '../Component/admin/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={2000} />
            <main style={{ flexGrow: 1, padding: '20px' }}>
                <Outlet /> { }
            </main>
        </div>
    );
};

export default AdminLayout;
