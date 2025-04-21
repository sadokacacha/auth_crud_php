import React from 'react';
import './login.css';

import logo from '../assets/logo.png'; 

const onSubmit = (event) => {
  event.preventDefault();

}
 



const Login = () => {
  return (
    <div className="login-container">
      <div className="login-section">
        <img src={logo} alt="College de Paris" className="logo" />
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn primary">Sign in</button>
          <button type="button" className="btn secondary">Connect With Alma</button>
        </form>
      </div>
    </div>
  );
};

export default Login;