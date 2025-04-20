import React from 'react';
import './login.css';
import profileIcon from './../../assets/profile_icon.png';
import login_img from './../../assets/login_img.png';
import eyeIcon from '../../assets/eye_icon (1).png';
import logo from '../../assets/logo.png';

const Login = () => {
  const backgroundStyle = {
    background: `url(${login_img}) no-repeat center center`,
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-panel">
        <img src={logo} alt="College de Paris" className="logo" />
        <h2>Login</h2>

        <div className="input-group">
          <label htmlFor="username"></label>
          <input type="text" id="username" placeholder="Nom" />
          <i className="fas fa-user">
            <img src={profileIcon} alt="User Icon" />
          </i>
        </div>

        <div className="input-group">
          <input type="password" id="password" placeholder="Mot De Passe" />
          <i className="fas fa-lock">
            <img src={eyeIcon} alt="Toggle Password" />
          </i>
        </div>

        <button className="btn">Entrer</button>
      </div>
    </div>
  );
};

export default Login;
