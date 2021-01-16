import React from 'react';
import axios from 'axios';
import { url } from '../CardSetupForm';

const Login = () => {
  const handleLogin = async () => {
    const { data: { data } } = await axios.post(`${url}/auth/login`, {
      email: 'kartalov.pt@gmail.com',
      password: 'test1234'
    });
    const token = data.token;
    console.log('token: ', token);
    localStorage.setItem('access_token', token);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <button
            onClick={handleLogin}
            className="btn btn-primary btn-lg w-50 mt-5"
          >
            Login
          </button>
        </div>
        <div className="col-12 text-center mt-1">
          <p className="h3">Logged in</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
