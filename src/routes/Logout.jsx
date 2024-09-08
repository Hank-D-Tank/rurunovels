import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../configs/firebase';
import { signOut } from "firebase/auth";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await signOut(auth);
                localStorage.removeItem('user');
                navigate('/');
            } catch (error) {
                console.error('Error signing out:', error);
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="logout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader"></div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;
