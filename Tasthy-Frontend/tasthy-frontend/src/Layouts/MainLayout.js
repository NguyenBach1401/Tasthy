import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '../routes/routes';
import Navbar from '../Component/navbar';
import Footer from '../Component/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MainLayout() {
    const location = useLocation();
    const hideLayout = ['/login', '/register'].includes(location.pathname);

    return (
        <>
            {!hideLayout && <Navbar />}
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={2000} />
            {!hideLayout && <Footer />}
        </>
    );
}

export default MainLayout;
