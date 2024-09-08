import React from 'react';
import Image from '../assets/notify-img.png';
import BtnPrimary from '../components/buttons/BtnPrimary';
import { RiLock2Line } from 'react-icons/ri';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return (
      <div className="protected-route">
        <div className="login-notify-model">
          <img src={Image} alt="Notification" />
          <div className="login-notify-model-heading">
          <RiLock2Line /> Access Denied
          </div>
          <div className="login-notify-model-message">
            <p>You must be logged in to view this page.</p>
            <BtnPrimary to='/login' className='btn-white'>Login</BtnPrimary>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
