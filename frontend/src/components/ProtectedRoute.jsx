import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
    let { user } = useContext(AuthContext);

    // Provide auth safety check wrapper, render child routes if user exists
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
